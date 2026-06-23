import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./paginas/Login";
import AdminPanel from "./paginas/AdminPanel";
import ClientePanel from "./paginas/ClientePanel";
import Usuarios from "./paginas/Usuarios";
import Productos from "./paginas/Productos";
import Categorias from "./paginas/Categorias";
import LoginForm from "./paginas/LoginForm";
import RutaProtegida from "./componentes/RutaProtegida";
import MisDatos from "./paginas/MisDatos";
import ProductosNuevo from "./paginas/ProductosNuevo";
import Cliente from "./paginas/Cliente";
import "react-toastify/dist/ReactToastify.css";
import PedidosAdmin from "./paginas/PedidosAdmin";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-form" element={<LoginForm />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <RutaProtegida rolPermitido="admin">
              <AdminPanel />
            </RutaProtegida>
          }
        />

        <Route
          path="/usuarios"
          element={
            <RutaProtegida rolPermitido="admin">
              <Usuarios />
            </RutaProtegida>
          }
        />

        <Route path="/producto" element={
  <RutaProtegida rolPermitido="admin">
    <ProductosNuevo />
  </RutaProtegida>
}/>

        <Route
          path="/categorias"
          element={
            <RutaProtegida rolPermitido="admin">
              <Categorias />
            </RutaProtegida>
          }
        />

        {/* CLIENTE */}
       <Route
  path="/cliente"
  element={
    <RutaProtegida rolPermitido="cliente">
      <Cliente />
    </RutaProtegida>
  }
/>
<Route
    path="/menucliente"
    element={
        <RutaProtegida rolPermitido="cliente">
            <Cliente />
        </RutaProtegida>
    }
/>

        <Route
          path="/misdatos"
          element={
            <RutaProtegida rolPermitido="cliente">
              <MisDatos />
            </RutaProtegida>
          }
        />
        <Route
    path="/pedidos"
    element={<PedidosAdmin />}
/>
         <Route path="/productos" element={
  <RutaProtegida rolPermitido="admin">
    <ProductosNuevo />
  </RutaProtegida>
}/>
      </Routes>
    </Router>
  );
}

export default App;