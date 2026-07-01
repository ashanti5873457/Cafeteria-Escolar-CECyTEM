import { useNavigate } from "react-router-dom";
import MenuPublico from "../componentes/MenuPublico";
import Footer from "../componentes/Footer";

function Login() {

  const navigate = useNavigate();

  return (
    <div>

      {/* 🟢 BARRA SUPERIOR (IGUAL AL FOOTER) */}
      <div className="bg-success p-2 d-flex justify-content-end shadow">

        <button
          onClick={() => navigate("/login-form")}
          className="btn btn-danger fw-bold px-4"
        >
          Iniciar Sesión
        </button>

      </div>

      {/*  IMAGEN CENTRADA */}
      <div style={{ backgroundColor: "#e8f5e9", padding: "20px" }}>
  
  <div className="text-center">
    <img
      src="/cafeteria.jpg"
      alt="cafeteria"
      className="shadow rounded"
      style={{
        width: "60%",        
        maxHeight: "250px",  
        objectFit: "contain" 
      }}
    />
  </div>

</div>
      {/* 🍔 PRODUCTOS */}
      <MenuPublico />

      {/* 🔻 FOOTER */}
      <Footer />

    </div>
  );
}

export default Login;