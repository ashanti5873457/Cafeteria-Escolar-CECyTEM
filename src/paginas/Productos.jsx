import { useEffect, useState } from "react";
import API from "../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductosCliente() {

    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);

    const cargarProductos = async () => {
        try {
            const res = await API.get("productos/");
            setProductos(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    // 🔥 cantidad en carrito
    const getCantidadEnCarrito = (id) => {
        const item = carrito.find(p => p.id_producto === id);
        return item ? item.cantidad : 0;
    };

    // 🛒 agregar
    const agregarAlCarrito = (producto) => {

        const cantidad = getCantidadEnCarrito(producto.id_producto);

        if (producto.stock <= 0) {
            toast.error("❌ Agotado");
            return;
        }

        if (cantidad >= producto.stock) {
            toast.error("❌ No hay más stock disponible");
            return;
        }

        setCarrito(prev => {
            const existe = prev.find(p => p.id_producto === producto.id_producto);

            if (existe) {
                return prev.map(p =>
                    p.id_producto === producto.id_producto
                        ? { ...p, cantidad: p.cantidad + 1 }
                        : p
                );
            }

            return [...prev, { ...producto, cantidad: 1 }];
        });

        toast.success("✔ Agregado al carrito");
    };

    return (
        <div className="container mt-4">

            <ToastContainer />

            <h2 className="fw-bold mb-4">Productos disponibles</h2>

            <div className="row g-3">

                {productos.map((p) => {

                    const cantidad = getCantidadEnCarrito(p.id_producto);
                    const sinStock = p.stock <= 0;
                    const limite = cantidad >= p.stock;

                    return (
                        <div className="col-md-4" key={p.id_producto}>

                            <div className="card shadow-sm h-100">

                                <div className="card-body d-flex flex-column">

                                    <h5>{p.nombre}</h5>

                                    <span className="badge bg-secondary mb-2">
                                        {p.categoria_nombre || "Sin categoría"}
                                    </span>

                                    <h4 className="text-success">${p.precio}</h4>

                                    <p>
                                        Stock:{" "}
                                        <span className={sinStock ? "text-danger" : "text-primary"}>
                                            {sinStock ? "Agotado" : p.stock}
                                        </span>
                                    </p>

                                    <button
                                        className={`btn mt-auto w-100 ${
                                            sinStock || limite
                                                ? "btn-secondary"
                                                : "btn-warning"
                                        }`}
                                        disabled={sinStock || limite}
                                        onClick={() => agregarAlCarrito(p)}
                                    >
                                        {sinStock
                                            ? "Agotado"
                                            : limite
                                                ? "Sin stock disponible"
                                                : "Agregar al carrito"}
                                    </button>

                                </div>
                            </div>

                        </div>
                    );
                })}

            </div>
        </div>
    );
}

export default ProductosCliente;