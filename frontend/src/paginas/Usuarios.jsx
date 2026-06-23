import { useEffect, useState } from "react";
import API from "../api/api";
import NavbarAdmin from "../componentes/NavbarAdmin";

function Usuarios() {

    const [usuarios, setUsuarios] = useState([]);

    // 🔥 CARGAR USUARIOS
    const cargarUsuarios = async () => {
        try {
            const res = await API.get("usuarios/");
            setUsuarios(res.data);
        } catch (error) {
            console.log("Error al cargar usuarios:", error);
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    return (
        <div>
            <NavbarAdmin />

            <div className="container-fluid mt-3">

                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-3">

                    <h2 className="fw-bold">👤 Gestión de Usuarios</h2>

                    <button
                        className="btn btn-secondary"
                        onClick={cargarUsuarios}
                    >
                        🔄 Recargar
                    </button>

                </div>

                <div className="row">

                    {/* TABLA */}
                    <div className="col-md-9">

                        <div className="card shadow-sm">

                            <div className="card-header bg-dark text-white">
                                Lista de Usuarios
                            </div>

                            <div className="card-body p-0">

                                <table className="table table-hover align-middle mb-0">

                                    <thead className="table-dark">
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Email</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {usuarios.length > 0 ? (
                                            usuarios.map((u) => (
                                                <tr key={u.id_usuario}>

                                                    <td>{u.id_usuario}</td>

                                                    <td className="fw-semibold">
                                                        {u.nombre}
                                                    </td>

                                                    <td>
                                                        {u.email}
                                                    </td>

                                                    <td>
                                                        <span className={`badge ${u.activo === 1 ? "bg-success" : "bg-danger"}`}>
                                                            {u.activo === 1 ? "Activo" : "Inactivo"}
                                                        </span>
                                                    </td>

                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center p-3">
                                                    No hay usuarios registrados
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
                                Panel Admin
                            </div>

                            <div className="card-body">

                                <div className="alert alert-info p-2">
                                    Total usuarios: {usuarios.length}
                                </div>

                                <div className="alert alert-warning p-2">
                                    Activos: {usuarios.filter(u => u.activo === 1).length}
                                </div>

                                <div className="alert alert-danger p-2">
                                    Inactivos: {usuarios.filter(u => u.activo !== 1).length}
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default Usuarios;