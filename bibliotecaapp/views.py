from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import transaction
from django.utils.timezone import localtime

from .models import (
    Usuario,
    Producto,
    Categoria,
    Pedido,
    DetallePedido
)

# =========================
# PRODUCTOS
# =========================
@api_view(['GET', 'POST', 'DELETE'])
def productos(request):

    try:

        # LISTAR
        if request.method == 'GET':
            data = []

            for p in Producto.objects.all():
                data.append({
                    "id_producto": p.id_producto,
                    "nombre": p.nombre,
                    "precio": float(p.precio),
                    "stock": p.stock,
                    "imagen": p.imagen,
                    "descripcion": p.descripcion,
                    "categoria": p.categoria.nombre
                })

            return Response(data)

        # CREAR PRODUCTO
        elif request.method == 'POST':

            categoria_id = request.data.get("categoria_id")
            categoria = Categoria.objects.get(id_categoria=categoria_id)

            producto = Producto.objects.create(
                nombre=request.data.get("nombre"),
                precio=request.data.get("precio"),
                stock=request.data.get("stock"),
                imagen=request.data.get("imagen"),
                descripcion=request.data.get("descripcion"),
                categoria=categoria
            )

            return Response({
                "mensaje": "Producto creado",
                "id_producto": producto.id_producto
            })

        # ELIMINAR
        elif request.method == 'DELETE':

            id_producto = request.query_params.get("id")

            producto = Producto.objects.filter(id_producto=id_producto).first()

            if not producto:
                return Response({"error": "No encontrado"}, status=404)

            producto.delete()

            return Response({"mensaje": "Eliminado"})

    except Exception as e:
        return Response({"error": str(e)}, status=500)


# =========================
# ACTUALIZAR PRODUCTO
# =========================
@api_view(['PUT'])
def actualizar_producto(request):

    Producto.objects.filter(
        id_producto=request.data.get("id_producto")
    ).update(
        nombre=request.data.get("nombre"),
        precio=request.data.get("precio"),
        stock=request.data.get("stock"),
        imagen=request.data.get("imagen"),
        descripcion=request.data.get("descripcion"),
        categoria_id=request.data.get("categoria_id")
    )

    return Response({"mensaje": "Producto actualizado"})


# =========================
# LOGIN
# =========================
@api_view(["POST"])
def login_user(request):

    user = Usuario.objects.filter(
        email=request.data.get("email"),
        password=request.data.get("password")
    ).first()

    if not user:
        return Response({"error": "Credenciales inválidas"}, status=400)

    return Response({
        "id_usuario": user.id_usuario,
        "nombre": user.nombre,
        "email": user.email,
        "rol": user.rol
    })


# =========================
# USUARIOS
# =========================
@api_view(['GET'])
def usuarios(request):

    return Response([
        {
            "id_usuario": u.id_usuario,
            "nombre": u.nombre,
            "email": u.email,
            "activo": u.activo,
            "rol": u.rol
        }
        for u in Usuario.objects.all()
    ])


# =========================
# CATEGORIAS
# =========================
@api_view(['GET'])
def categorias(request):

    data = []

    for c in Categoria.objects.all():

        productos = []

        for p in c.productos.all():

            productos.append({
                "id_producto": p.id_producto,
                "nombre": p.nombre,
                "precio": float(p.precio),
                "stock": p.stock
            })

        data.append({
            "id_categoria": c.id_categoria,
            "nombre": c.nombre,
            "total_productos": len(productos),
            "productos": productos
        })

    return Response(data)


# =========================
# PEDIDOS (FIX FINAL HORA MÉXICO)
# =========================
@api_view(["GET"])
def pedidos(request):

    data = []

    for pedido in Pedido.objects.all().order_by("-fecha"):

        fecha_mx = localtime(pedido.fecha)  # 🔥 CONVERSIÓN REAL

        productos = []

        for detalle in pedido.detalles.all():
            productos.append({
                "producto": detalle.producto.nombre,
                "cantidad": detalle.cantidad,
                "precio": float(detalle.precio)
            })

        data.append({
            "id_pedido": pedido.id_pedido,
            "cliente": pedido.usuario.nombre,
            "email": pedido.usuario.email,

            "fecha": fecha_mx.strftime("%d/%m/%Y %H:%M:%S"),  # 🔥 MÉXICO

            "total": float(pedido.total),
            "productos": productos
        })

    return Response(data)

# =========================
# COMPRAR (STOCK REAL)
# =========================
@api_view(["POST"])
def comprar(request):

    try:
        usuario = Usuario.objects.get(id_usuario=request.data.get("usuario_id"))
        items = request.data.get("items", [])

        with transaction.atomic():

            pedido = Pedido.objects.create(usuario=usuario, total=0)

            total = 0

            for item in items:

                producto = Producto.objects.get(
                    id_producto=item["producto_id"]
                )

                cantidad = item.get("cantidad", 1)

                if producto.stock < cantidad:
                    return Response(
                        {"error": f"Sin stock de {producto.nombre}"},
                        status=400
                    )

                producto.stock -= cantidad
                producto.save()

                DetallePedido.objects.create(
                    pedido=pedido,
                    producto=producto,
                    cantidad=cantidad,
                    precio=producto.precio
                )

                total += float(producto.precio) * cantidad

            pedido.total = total
            pedido.save()

        return Response({"mensaje": "Pedido creado correctamente"})

    except Exception as e:
        return Response({"error": str(e)}, status=500)