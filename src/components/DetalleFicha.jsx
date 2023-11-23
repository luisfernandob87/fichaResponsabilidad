import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import logo from "../assets/iungo.png";

function DetalleFicha() {

    const token = localStorage.getItem("token");
    const idDetalle = localStorage.getItem("idDetalle");
  
    const [info, setInfo] = useState([]);
  
    const page = "http://localhost:1337";
  
    const config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    useEffect(() => {
        axios
          .get(`${page}/api/fichas/${idDetalle}?populate=*`, config)
          .then((res) => setInfo(res.data.data))
          .catch(function (error) {
            console.log(error);
          });
      }, []);

      console.log(info);
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
    <form style={{ maxWidth: 800 }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
        <img src={logo} alt="Logo" style={{  maxHeight: 60 }} />{" "}
        <div>
          <h2 style={{ margin: 0 }}>Hoja de Responsabilidad</h2>
        </div>
      </div>

      <hr style={{ margin: 0 }} />
      <p style={{ textAlign: "end", margin: 0 }}>
        Fecha de entrega:{" "}
        <strong>
          {moment(info.attributes?.fechaEntrega).format(
            "DD/MM/YYYY"
          )}
        </strong>
      </p>
      <p style={{ marginTop: 5, textAlign: "start" }}>A quien corresponda:</p>
      <div className="container">
        <p style={{ margin: 5, textAlign: "start" }}>
          Yo <strong>{info.attributes?.responsable.data.attributes.nombreCompleto}</strong> recibí de bodega el equipo de trabajo que se menciona a continuación:
        </p>
        <p style={{ margin: 5, textAlign: "start" }}>
          Autorizado por: <strong>{info.attributes?.supervisor.data.attributes.nombreCompleto}</strong> 
        </p>

      </div>
      <div className="container">
        <p style={{ margin: 5, textAlign: "start" }}>
            Equipo o herramienta: <strong>{info.attributes?.equipo.data.attributes.descripcion}</strong>
        </p>
        <p style={{ margin: 5, textAlign: "start" }}>
          Número de serie: <strong>{info.attributes?.serie}</strong>
        </p>
        <p style={{ margin: 5, textAlign: "start" }}>
          Ubicación: <strong>{info.attributes?.ubicacion.data.attributes.descripcion}</strong>
        </p>
        <p style={{ margin: 5, textAlign: "start" }}>
          Motivo de prestamo: <strong>{info.attributes?.motivo}</strong>
        </p>
        <p style={{ textAlign: "start", margin: 0 }}>
        Fecha de devolución:{" "}
        <strong>
          {info.attributes?.fechaDevolucion == null ? "Pendiente" : moment(info.attributes?.fechaDevolucion).format(
            "DD/MM/YYYY"
          )}
        </strong>
      </p>
        <p style={{ margin: 0, textAlign: "justify" }}>
          El cual se me hace entrega en óptimas condiciones para su debido uso, comprometiendome a cuidarlo,
          mantener en buen estado y utilizarlo única y exclusivamente para asuntos relacionados con mi actividad
          laboral. 
        </p>        
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "space-around" }}>
        <div
          style={{
            width: "33%",
            borderWidth: 1,
            borderStyle: "solid",
            borderRadius: 10,
            alignSelf: "center",
            height: 160,
          }}
        >
          <p style={{ textAlign: "center", margin: 0 }}>
            Firma Responsable(a)
          </p>
          <img
            style={{ maxWidth: "75%" }}
            src={info.attributes?.firmaResponsable}
            alt="Firma Responsable"
          />
        </div>
        <div
          style={{
            width: "33%",
            borderStyle: "solid",
            borderRadius: 10,
            borderWidth: 1,
            alignSelf: "center",
            height: 160,
          }}
        >
          <p style={{ textAlign: "center", margin: 0 }}>
            Firma Encargado
          </p>
          <img
            style={{ maxWidth: "75%" }}
            src={info.attributes?.firmaEncargado}
            alt="Firma Encargado"
          />
        </div>
      </div>
    </form>
  </div>
  )
}

export default DetalleFicha
