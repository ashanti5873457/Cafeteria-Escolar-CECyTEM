from django.db import models

# =========================
# VISTA (SOLO LECTURA SQL)
# =========================
class VistaPedido(models.Model):
    id_pedido = models.IntegerField(primary_key=True)
    cliente = models.CharField(max_length=100)
    email = models.EmailField()
    fecha = models.DateTimeField()
    total = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        managed = False  # 🔥 importante: Django NO toca esta tabla
        db_table = "vista_pedidos"


# =========================
# USUARIO
# =========================
class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    email = models.EmailField()
    password = models.CharField(max_length=255)
    activo = models.BooleanField(default=True)
    rol = models.CharField(max_length=20, default="cliente")

    class Meta:
        db_table = "usuario"


# =========================
# CATEGORIA
# =========================
class Categoria(models.Model):
    id_categoria = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)

    class Meta:
        db_table = "categoria"


# =========================
# PRODUCTO
# =========================
class Producto(models.Model):
    id_producto = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    imagen = models.TextField()
    descripcion = models.TextField()

    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.CASCADE,
        db_column="categoria_id",
        related_name="productos"
    )

    class Meta:
        db_table = "producto"


# =========================
# PEDIDO (REAL DEL SISTEMA)
# =========================
class Pedido(models.Model):
    id_pedido = models.AutoField(primary_key=True)

    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        db_column="usuario_id",
        related_name="pedidos"
    )

    fecha = models.DateTimeField(auto_now_add=True)  # UTC interno (CORRECTO)
    total = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = "pedido"


# =========================
# DETALLE PEDIDO
# =========================
class DetallePedido(models.Model):
    id_detalle = models.AutoField(primary_key=True)

    pedido = models.ForeignKey(
        Pedido,
        on_delete=models.CASCADE,
        related_name="detalles",
        db_column="pedido_id"
    )

    producto = models.ForeignKey(
        Producto,
        on_delete=models.CASCADE,
        db_column="producto_id"
    )

    cantidad = models.IntegerField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = "detalle_pedido"