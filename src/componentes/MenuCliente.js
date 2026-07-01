import { useEffect, useState } from "react";
import API from "../api/api";
import NavbarCliente from "./NavbarCliente";

function MenuCliente() {

    const [productos, setProductos] = useState([]);
    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        const response = await API.get("productos/");
        setProductos(response.data);
    };

    return (
        <>
            <NavbarCliente />

            <div className="container mt-4">

                <h2>Menú de Productos</h2>

                <div className="row">

                    {productos.map((producto) => (

                        <div
                            className="col-md-4 mb-3"
                            key={producto.id_producto}
                        >

                            <div className="card">

                                <div className="card-body">

                                    <h5>{producto.nombre}</h5>

                                    <p>{producto.descripcion}</p>

                                    <h4>${producto.precio}</h4>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>
        </>
    );
}

export default MenuCliente;