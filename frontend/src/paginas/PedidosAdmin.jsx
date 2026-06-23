import { useEffect, useState } from "react";
import API from "../api/api";

function PedidosAdmin() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      const res = await API.get("pedidos/");
      setPedidos(res.data);
    } catch (error) {
      console.log(error);
      alert("Error al cargar pedidos");
    }
  };

  // ✅ FECHA CORREGIDA A HORA MÉXICO (versión más segura)
  const formatearFechaMX = (fecha) => {
  if (!fecha) return "Sin fecha";

  // 🔧 convertir formato raro a ISO válido
  const fechaLimpia = fecha
    .replace(" ", "T")           // espacio → T
    .split(".")[0];              // quitar microsegundos

  const fechaObj = new Date(fechaLimpia);

  if (isNaN(fechaObj.getTime())) {
    return "Fecha inválida";
  }

  return new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(fechaObj);
};
  return (
    <div className="container mt-4">
      <h2 className="mb-4">📦 Pedidos Realizados</h2>

      <div className="table-responsive">
        <table className="table table-hover shadow">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Email</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Productos</th>
            </tr>
          </thead>

          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id_pedido}>
                <td>#{pedido.id_pedido}</td>
                <td>{pedido.cliente}</td>
                <td>{pedido.email}</td>

                {/* ✅ FECHA EN HORA MÉXICO CORREGIDA */}
                <td>{formatearFechaMX(pedido.fecha)}</td>

                <td className="text-success fw-bold">
                  ${pedido.total}
                </td>

                <td>
                  {pedido.productos.map((p, i) => (
                    <div key={i}>
                      🥐 {p.producto} (x{p.cantidad})
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PedidosAdmin;