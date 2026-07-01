import { Link, useNavigate } from "react-router-dom";

function Admin() {

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("usuario");
        navigate("/login");
    };

    return (

        <div>

            {/* NAVBAR */}
            <nav className="navbar navbar-dark bg-dark px-4">

                <div className="container-fluid">

                    <Link className="navbar-brand" to="/admin">
                        Administracion Cafeteria
                    </Link>

                    <div>

                        <Link className="btn btn-outline-light me-2" to="/productos">
                            Productos
                        </Link>

                        <Link className="btn btn-outline-light me-2" to="/categorias">
                            Categorias
                        </Link>

                        <Link className="btn btn-outline-light me-2" to="/usuarios">
                            Usuarios
                        </Link>

                        <button
                            className="btn btn-danger"
                            onClick={logout}
                        >
                            Cerrar sesion
                        </button>

                    </div>

                </div>

            </nav>

            {/* CONTENIDO */}
            <div className="container mt-4">

                <h1 className="fw-bold">
                    Panel Administrador
                </h1>

                <hr />

                <h3 className="mb-4">
                    Bienvenido Ashanti Sherlin
                </h3>

                <div className="row">

                    {/* PRODUCTOS */}
                    <div className="col-md-3 mb-3">

                        <div className="card shadow-sm p-3">

                            <h4>Productos</h4>

                            <p className="text-muted">
                                Gestionar productos
                            </p>

                        </div>

                    </div>

                    {/* CATEGORIAS */}
                    <div className="col-md-3 mb-3">

                        <div className="card shadow-sm p-3">

                            <h4>Categorías</h4>

                            <p className="text-muted">
                                Gestionar categorías
                            </p>

                        </div>

                    </div>

                    {/* USUARIOS */}
                    <div className="col-md-3 mb-3">

                        <div className="card shadow-sm p-3">

                            <h4>Usuarios</h4>

                            <p className="text-muted">
                                Gestionar usuarios
                            </p>

                        </div>

                    </div>

                    {/* PEDIDOS */}
                    <div className="col-md-3 mb-3">

                        <div className="card shadow-sm p-3">

                            <h4>Pedidos</h4>

                            <p className="text-muted">
                                Gestionar pedidos
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Admin;