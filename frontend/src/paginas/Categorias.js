import { useEffect, useState } from "react";
import API from "../api/api";
import NavbarAdmin from "../componentes/NavbarAdmin";

function Categorias() {
    const [categorias, setCategorias] = useState([]);

    const cargarCategorias = async () => {
        try {
            const res = await API.get("categorias/");
            setCategorias(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.log("Error al cargar categorías:", error);
            setCategorias([]);
        }
    };

    useEffect(() => {
        cargarCategorias();
    }, []);

    return (
        <div>
            <NavbarAdmin />

            <div className="container-fluid mt-3">

                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="fw-bold">📦 Gestión de Categorías</h2>

                    <button className="btn btn-secondary" onClick={cargarCategorias}>
                        🔄 Recargar
                    </button>
                </div>

                <div className="row">

                    {/* TABLA */}
                    <div className="col-md-9">
                        <div className="card shadow-sm">
                            <div className="card-header bg-dark text-white">
                                Lista de Categorías
                            </div>

                            <div className="card-body p-0">
                                <table className="table table-hover align-middle mb-0">

                                    <thead className="table-dark">
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Productos</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {categorias.length > 0 ? (
                                            categorias.map((categoria) => (
                                                <tr key={categoria.id_categoria}>

                                                    <td>{categoria.id_categoria}</td>
                                                    <td>{categoria.nombre}</td>

                                                    {/* PRODUCTOS */}
                                                    <td>
                                                        {categoria.productos && categoria.productos.length > 0 ? (
                                                            categoria.productos.map((p) => (
                                                                <span
                                                                    key={p.id_producto}
                                                                    className="badge bg-info me-1"
                                                                >
                                                                    {p.nombre} (${p.precio})
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-muted">
                                                                Sin productos
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* ESTADO */}
                                                    <td>
                                                        <span
                                                            className={`badge ${
                                                                categoria.activo === 1
                                                                    ? "bg-success"
                                                                    : "bg-danger"
                                                            }`}
                                                        >
                                                            {categoria.activo === 1
                                                                ? "Activo"
                                                                : "Inactivo"}
                                                        </span>
                                                    </td>

                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center p-3">
                                                    No hay categorías registradas
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>

                                </table>
                            </div>
                        </div>
                    </div>

                    {/* PANEL LATERAL */}
                    <div className="col-md-3">
                        <div className="card shadow-sm">

                            <div className="card-header bg-primary text-white">
                                Panel de Categorías
                            </div>

                            <div className="card-body">
                                <div className="alert alert-info p-2">
                                    Total categorías: {categorias.length}
                                </div>

                                <div className="alert alert-success p-2">
                                    Activas: {categorias.filter(c => c.activo === 1).length}
                                </div>

                                <div className="alert alert-danger p-2">
                                    Inactivas: {categorias.filter(c => c.activo !== 1).length}
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Categorias;