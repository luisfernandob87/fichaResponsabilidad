import { useNavigate } from "react-router-dom";
// import logo from "../assets/logo.png";
// import depto from "../assets/depto.png";
// import empleado from "../assets/empleado.png";
// import llamada from "../assets/llamada.png";
// import puesto from "../assets/puesto.png";
// import usuarioImg from "../assets/usuario.png";
// import salida from "../assets/salida.png";
// import cartera from "../assets/cartera.png";

function Menu() {
  const navigate = useNavigate();
  // const usuario = localStorage.getItem("usuario").replace(".", " ");
  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <h1 style={{ marginTop: 0, marginBottom: 20 }}>
        {/* Bienvenid@ 👋 {usuario} */}
      </h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/equipos");
          }}
        >
          <h4>Equipos</h4>
          {/* <img src={depto} alt="Departamento" className="imgMenu" /> */}
        </div>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/tecnicos");
          }}
        >
          <h4>Técnicos</h4>
          {/* <img src={cartera} alt="Cartera" className="imgMenu" /> */}
        </div>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/ubicacion");
          }}
        >
          <h4>Ubicaciones</h4>
          {/* <img src={empleado} alt="Empleado" className="imgMenu" /> */}
        </div>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/ficha");
          }}
        >
          <h4>Ficha de Responsabilidad</h4>
          {/* <img src={llamada} alt="Llamada de atención" className="imgMenu" /> */}
        </div>
        <div style={{ cursor: "pointer" }} onClick={cerrarSesion}>
          <h4>Cerrar Sesión</h4>
          {/* <img src={salida} alt="Cerrar Sesión" className="imgMenu" /> */}
        </div>
      </div>
      {/* <img
        style={{ marginTop: 50 }}
        src={logo}
        alt="Logo"
        className="imgMenu"
      /> */}
    </div>
  );
}

export default Menu;
