import NavbarCliente from "../componentes/NavbarCliente";

function MisDatos() {

  const usuario = JSON.parse(
    localStorage.getItem("usuario") || "{}"
  );

  return (
    <>
      <NavbarCliente />

      <div
        className="container mt-5 d-flex justify-content-center"
      >
        <div
          className="card shadow-lg border-0"
          style={{
            width: "500px",
            borderRadius: "20px"
          }}
        >

          <div
            className="card-header text-center text-white"
            style={{
              background:
                "linear-gradient(135deg,#198754,#20c997)",
              borderRadius: "20px 20px 0 0"
            }}
          >
            <h2 className="mt-3">
              Mi Perfil
            </h2>
          </div>

          <div className="card-body text-center">

            <img
              src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
              alt="Usuario"
              style={{
                width: "120px",
                height: "120px",
                marginTop: "-70px",
                border: "5px solid white",
                borderRadius: "50%",
                backgroundColor: "white"
              }}
            />

            <h3 className="mt-3 fw-bold text-dark">
              {usuario.nombre || "Usuario"}
            </h3>

            <hr />

            <div className="text-start">

              <div className="mb-3">
                <h5> Nombre</h5>
                <p className="text-muted">
                  {usuario.nombre || "No disponible"}
                </p>
              </div>

              <div className="mb-3">
                <h5> Correo</h5>
                <p className="text-muted">
                  {usuario.email || "No disponible"}
                </p>
              </div>

              <div className="mb-3">
                <h5> Rol</h5>
                <p className="text-muted">
                  {usuario.rol || "No disponible"}
                </p>
              </div>

              <div className="mb-3">
                <h5> Estado</h5>
                <span className="badge bg-success fs-6">
                   En línea
                </span>
              </div>

            </div>

          </div>

          <div className="card-footer text-center bg-light">
            <small className="text-muted">
              Información de tu cuenta en Cafetería Escolar
            </small>
          </div>

        </div>
      </div>
    </>
  );
}

export default MisDatos;