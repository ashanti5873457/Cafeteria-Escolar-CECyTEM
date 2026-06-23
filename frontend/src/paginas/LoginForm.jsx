import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e?.preventDefault();

    try {
      console.log("Datos enviados:", { email, password });

      const res = await API.post("login/", {
        email,
        password,
      });

      console.log("Respuesta backend:", res.data);

      const user = res.data;
      console.log(user);

      if (!user) {
        alert("No se recibió usuario del servidor");
        return;
      }

      localStorage.setItem("usuario", JSON.stringify(user));

      if (user.rol === "admin") {
        navigate("/admin");
      } else {
        navigate("/cliente");
      }

    } catch (error) {
      console.log("Error login:", error);

      if (error.response) {
        alert(
          typeof error.response.data === "string"
            ? error.response.data
            : JSON.stringify(error.response.data)
        );
      } else {
        alert(error.message);
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center mt-5">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center">Iniciar Sesión</h3>

        <input
          className="form-control mb-2"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="form-control mb-3"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-success w-100" onClick={login}>
          Entrar
        </button>
      </div>
    </div>
  );
}

export default LoginForm;