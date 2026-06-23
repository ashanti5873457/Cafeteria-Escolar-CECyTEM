import { Navigate } from "react-router-dom";

function RutaProtegida({ children, rolPermitido }) {

    const usuario = JSON.parse(
        localStorage.getItem("usuario")
    );

    if (!usuario) {
        return <Navigate to="/login" />;
    }

    const rol = (
        usuario.rol ||
        usuario.role ||
        usuario.tipo ||
        ""
    ).toLowerCase();

    if (rol !== rolPermitido) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default RutaProtegida;