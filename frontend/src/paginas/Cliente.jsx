import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./Cliente.css";

function Cliente() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [vista, setVista] = useState("productos");

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    const res = await API.get("productos/");
    setProductos(res.data);
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // 🛒 AGREGAR AL CARRITO (CON STOCK)
  const agregarAlCarrito = (prod) => {
    setCarrito((prev) => {
      const existe = prev.find(
        (p) => p.id_producto === prod.id_producto
      );

      const cantidadActual = existe ? existe.cantidad : 0;

      // 🚨 NO dejar pasar del stock
      if (cantidadActual >= prod.stock) {
        alert("⚠️ No hay más stock disponible");
        return prev;
      }

      if (existe) {
        return prev.map((p) =>
          p.id_producto === prod.id_producto
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        );
      }

      return [
        ...prev,
        {
          id_producto: prod.id_producto,
          nombre: prod.nombre,
          precio: prod.precio,
          stock: prod.stock,
          cantidad: 1,
        },
      ];
    });
  };

  // ➕ ➖ CANTIDAD (CON CONTROL DE STOCK)
  const cambiarCantidad = (id, delta) => {
    setCarrito((prev) =>
      prev
        .map((p) => {
          if (p.id_producto !== id) return p;

          const nuevaCantidad = p.cantidad + delta;

          // ❌ no permitir menos de 1
          if (nuevaCantidad < 1) return p;

          // ❌ no permitir más que stock
          if (nuevaCantidad > p.stock) {
            alert("⚠️ No puedes superar el stock disponible");
            return p;
          }

          return { ...p, cantidad: nuevaCantidad };
        })
        .filter((p) => p.cantidad > 0)
    );
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) =>
      prev.filter((p) => p.id_producto !== id)
    );
  };

  const total = carrito.reduce(
    (sum, p) => sum + Number(p.precio) * p.cantidad,
    0
  );

  // 💳 COMPRA
  const pagar = async () => {
    try {
      const items = carrito.map((p) => ({
        producto_id: p.id_producto,
        cantidad: p.cantidad,
      }));

      await API.post("comprar/", {
        usuario_id: usuario.id_usuario,
        items,
      });

      alert("✅ Pedido realizado");

      setCarrito([]);
      cargarProductos();
    } catch (error) {
      console.log(error.response?.data || error);
      alert(error.response?.data?.error || "❌ Error al comprar");
    }
  };

  return (
    <div className="cliente-container">

      {/* HEADER */}
      <div className="header">
        <h2>☕ Cafetería Online</h2>

        <div className="header-right">

          <input
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <button onClick={() => setVista("perfil")}>
            👤 Mis Datos
          </button>

          <button onClick={() => setVista("productos")}>
            🛍 Productos
          </button>

          <button onClick={() => navigate("/")}>
            Salir
          </button>

        </div>
      </div>

      {/* 👤 PERFIL */}
      {vista === "perfil" && (
        <div className="profile-container">
          <div className="profile-card">

            <div className="avatar">
              {usuario?.nombre?.charAt(0)}
            </div>

            <h2 className="profile-name">
              {usuario?.nombre}
            </h2>

            <p className="profile-sub">
              👤 Usuario registrado
            </p>

            <div className="profile-info">

              <div className="info-row">
                <span>📧 Email</span>
                <b>{usuario?.email}</b>
              </div>

              <div className="info-row">
                <span>🆔 ID</span>
                <b>{usuario?.id_usuario}</b>
              </div>

              <div className="info-row">
                <span>🧭 Rol</span>
                <b className="badge rol">
                  {usuario?.rol || "cliente"}
                </b>
              </div>

              <div className="info-row">
                <span>⚡ Estado</span>
                <b className={`badge ${usuario?.activo ? "active" : "inactive"}`}>
                  {usuario?.activo ? "Activo" : "Inactivo"}
                </b>
              </div>

            </div>

            <button
              className="btn-back"
              onClick={() => setVista("productos")}
            >
              🔙 Regresar
            </button>

          </div>
        </div>
      )}

      {/* 🛍 PRODUCTOS */}
      {vista === "productos" && (
        <>
          <div className="productos-grid">

            {productosFiltrados.map((p) => {
              const enCarrito = carrito.find(c => c.id_producto === p.id_producto);
              const cantidadEnCarrito = enCarrito ? enCarrito.cantidad : 0;
              const sinStock = cantidadEnCarrito >= p.stock;

              return (
                <div className="card-producto" key={p.id_producto}>

                  <img src={p.imagen || "/placeholder.png"} />

                  <h3>{p.nombre}</h3>
                  <p>{p.descripcion}</p>

                  <b>${p.precio}</b>

                  <p className={p.stock <= 0 ? "agotado" : "stock"}>
                    Stock: {p.stock}
                  </p>

                  <button
                    disabled={p.stock <= 0 || sinStock}
                    onClick={() => agregarAlCarrito(p)}
                  >
                    Agregar
                  </button>

                </div>
              );
            })}

          </div>

          {/* 🛒 CARRITO */}
          <div className="carrito">

            <h3>🛒 Carrito</h3>

            {carrito.length === 0 && <p>Vacío</p>}

            {carrito.map((p) => (
              <div key={p.id_producto} className="carrito-item">

                <span>{p.nombre}</span>

                <div>
                  <button onClick={() => cambiarCantidad(p.id_producto, -1)}>
                    -
                  </button>

                  <span>{p.cantidad}</span>

                  <button
                    onClick={() => cambiarCantidad(p.id_producto, 1)}
                    disabled={p.cantidad >= p.stock}
                  >
                    +
                  </button>
                </div>

                <span>${p.precio * p.cantidad}</span>

                <button onClick={() => eliminarDelCarrito(p.id_producto)}>
                  ❌
                </button>

              </div>
            ))}

            <h3>Total: ${total.toFixed(2)}</h3>

            <button className="btn-pagar" onClick={pagar}>
              Confirmar pedido
            </button>

          </div>
        </>
      )}

    </div>
  );
}

export default Cliente;