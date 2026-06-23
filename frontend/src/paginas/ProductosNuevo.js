import { useEffect, useState } from "react";
import API from "../api/api";
import "./productos.css";

function ProductosNuevo() {

  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [buscar, setBuscar] = useState("");

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const esAdmin = usuario?.rol === "admin";

  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    stock: "",
    imagen: "",
    descripcion: ""
  });

  // ======================
  // CARGAR PRODUCTOS
  // ======================
  const cargarProductos = async () => {
    try {
      const res = await API.get("productos/");
      setProductos(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const getId = (p) => p?.id_producto || p?.id;

  // ======================
  // ABRIR AGREGAR
  // ======================
  const abrirAgregar = () => {
    setModoEdicion(false);
    setProductoEditando(null);

    setForm({
      nombre: "",
      precio: "",
      stock: "",
      imagen: "",
      descripcion: ""
    });

    setMostrarModal(true);
  };

  // ======================
  // ABRIR EDITAR
  // ======================
  const abrirEditar = (p) => {
    setModoEdicion(true);
    setProductoEditando(p);

    setForm({
      nombre: p.nombre || "",
      precio: p.precio || "",
      stock: p.stock || "",
      imagen: p.imagen || "",
      descripcion: p.descripcion || ""
    });

    setMostrarModal(true);
  };

  // ======================
  // GUARDAR (CREAR / EDITAR)
  // ======================
  const guardar = async () => {
    const id = productoEditando ? getId(productoEditando) : null;

    try {

      if (modoEdicion) {

        await API.put("productos/actualizar/", {
          id_producto: id,
          nombre: form.nombre,
          precio: Number(form.precio),
          stock: Number(form.stock),
          imagen: form.imagen.trim(),
          descripcion: form.descripcion
        });

      } else {

        await API.post("productos/", {
          nombre: form.nombre,
          precio: Number(form.precio),
          stock: Number(form.stock),
          imagen: form.imagen.trim(),
          descripcion: form.descripcion
        });

      }

      await cargarProductos(); // 🔥 IMPORTANTE (FIX REAL)
      setMostrarModal(false);
      setProductoEditando(null);

    } catch (error) {
      console.log(error.message);
    }
  };

  // ======================
  // ELIMINAR
  // ======================
  const eliminar = async (p) => {

    const id = p.id_producto;

    const confirmar = window.confirm(
        `¿Está segur@ de eliminar el producto "${p.nombre}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmar) return;

    try {

        await API.delete(`productos/?id=${id}`);

        alert("✅ Producto eliminado correctamente");

        cargarProductos();

    } catch (error) {

        console.log(error);

        alert("❌ Error al eliminar el producto");

    }
};

  // ======================
  // CARRITO
  // ======================
  const agregarCarrito = (p) => {
    setCarrito([...carrito, p]);
  };

  // ======================
  // IMG SEGURA
  // ======================
  const fixImg = (url) =>
    url || "https://via.placeholder.com/300x200?text=Sin+Imagen";

  const filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(buscar.toLowerCase())
  );

  return (
    <div className="container mt-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">

        <div>
          <h2 className="titulo-productos">📦 Productos</h2>

          <input
            className="form-control mt-2 shadow-sm"
            placeholder="🔍 Buscar..."
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
          />
        </div>

        <div className="d-flex gap-2">

          <button className="btn-back" onClick={() => window.history.back()}>
            ⬅ Regresar
          </button>

          {esAdmin && (
            <button className="btn-success-modern btn-modern" onClick={abrirAgregar}>
              ➕ Agregar
            </button>
          )}

        </div>
      </div>

      {/* GRID */}
      <div className="row g-4">

        {filtrados.map((p) => {

          const agotado = Number(p.stock) <= 0;

          return (
            <div className="col-md-4" key={getId(p)}>

              <div className="card product-card shadow-lg border-0">

                <img
                  src={fixImg(p.imagen)}
                  className="card-img-top product-img"
                  onClick={() => setProductoSeleccionado(p)}
                />

                <div className="card-body text-center">

                  <h5>{p.nombre}</h5>

                  <h4 className="text-success">
                    ${Number(p.precio).toFixed(2)}
                  </h4>

                  <p className="text-muted small">
                    {p.descripcion || "Sin descripción"}
                  </p>

                  <p>
                    Stock:{" "}
                    <b className={agotado ? "text-danger" : "text-primary"}>
                      {agotado ? "AGOTADO" : p.stock}
                    </b>
                  </p>

                  {esAdmin ? (
                    <div className="d-flex gap-2">

                      <button
                        className="btn-warning-modern btn-modal w-50"
                        onClick={() => abrirEditar(p)}
                      >
                        ✏ Editar
                      </button>

                      <button
                        className="btn-danger-modern btn-modal w-50"
                        onClick={() => eliminar(p)}
                      >
                        🗑 Eliminar
                      </button>

                    </div>
                  ) : (
                    <button
                      className="btn-add"
                      disabled={agotado}
                      onClick={() => agregarCarrito(p)}
                    >
                      🛒 Agregar
                    </button>
                  )}

                </div>
              </div>
            </div>
          );
        })}

      </div>

      {/* MODAL VER */}
      {productoSeleccionado && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">

              <img
                src={fixImg(productoSeleccionado.imagen)}
                className="w-100 rounded mb-3"
                style={{ height: "250px", objectFit: "cover" }}
              />

              <h3>{productoSeleccionado.nombre}</h3>

              <h4 className="text-success">
                ${Number(productoSeleccionado.precio).toFixed(2)}
              </h4>

              <p>
                {productoSeleccionado?.descripcion || "Sin descripción"}
              </p>

              <button
                className="btn-back w-100"
                onClick={() => setProductoSeleccionado(null)}
              >
                Cerrar
              </button>

            </div>
          </div>
        </div>
      )}

      {/* MODAL ADMIN */}
      {mostrarModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">

              <h4 className="text-center">
                {modoEdicion ? "Editar producto" : "Nuevo producto"}
              </h4>

              <input className="form-control mb-2"
                placeholder="Nombre"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />

              <input className="form-control mb-2"
                placeholder="Precio"
                type="number"
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
              />

              <input className="form-control mb-2"
                placeholder="Stock"
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />

              <input className="form-control mb-2"
                placeholder="Imagen URL"
                value={form.imagen}
                onChange={(e) => setForm({ ...form, imagen: e.target.value })}
              />

              <textarea
                className="form-control mb-3"
                placeholder="Descripción"
                value={form.descripcion}
                onChange={(e) =>
                  setForm({ ...form, descripcion: e.target.value })
                }
              />

              <div className="d-flex gap-2">

                <button
                  className="btn-modal btn-cancel w-50"
                  onClick={() => {
                    setMostrarModal(false);
                    setProductoEditando(null);
                  }}
                >
                  Cancelar
                </button>

                <button
                  className="btn-modal btn-save w-50"
                  onClick={guardar}
                >
                  Guardar
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ProductosNuevo;