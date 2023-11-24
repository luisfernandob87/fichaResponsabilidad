import MenuTop from "./MenuTop";
import { useNavigate } from "react-router-dom";
import add from "../assets/add.png";
import search from "../assets/search.png";
import check from "../assets/check.svg";

function Ficha() {
  const navigate = useNavigate();
  return (
    <>
      <MenuTop />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "10%",
        }}
      >
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/crear");
          }}
        >
          <img src={add} alt="Add" className="imgMenu" />
          <h4>Crear Hoja de Responsabilidad</h4>
        </div>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/consultar");
          }}
        >
          <img src={search} alt="Search" className="imgMenu" />
          <h4>Consultar Hojas de Responsabilidad</h4>
        </div>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/recepcion");
          }}
        >
          <img src={check} alt="Search" className="imgMenu" />
          <h4>Entrega de Equipo o Herramienta</h4>
        </div>
      </div>
    </>
  );
}
export default Ficha;
