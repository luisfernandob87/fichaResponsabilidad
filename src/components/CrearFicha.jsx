import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useForm } from "react-hook-form";
import moment from "moment";
import Swal from "sweetalert2";
import logo from "../assets/iungo.png";
import { useNavigate } from "react-router-dom";

function CrearFicha() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const usuario = localStorage.getItem("usuario");

  const { register, handleSubmit, reset } = useForm();

  const page = "http://localhost:1337";

  const config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  const [tecnicos, setTecnicos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);

  useEffect(() => {
    axios
      .get(`${page}/api/tecnicos?populate=*&filters[estado][$eq]=true`, config)
      .then((res) => setTecnicos(res.data.data))
      .catch(function (error) {
        console.log(error);
      });
    axios
      .get(`${page}/api/equipos?filters[estado][$eq]=true`, config)
      .then((res) => setEquipos(res.data.data))
      .catch(function (error) {
        console.log(error);
      });
    axios
      .get(`${page}/api/ubicacions?filters[estado][$eq]=true`, config)
      .then((res) => setUbicaciones(res.data.data))
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const [selectedResponsable, setSelectedResponsable] = useState("");
  const [selectedSupervisor, setSelectedSupervisor] = useState("");
  const [selectedEquipo, setSelectedEquipo] = useState("");
  const [selectedUbicacion, setSelectedUbicacion] = useState("");

  const handleChange = (event) => {
    setSelectedResponsable(event.target.value);
  };

  const handleSupervisor = (event) => {
    setSelectedSupervisor(event.target.value);
  };

  const handleEquipo = (event) => {
    setSelectedEquipo(event.target.value);
  };

  const handleUbicacion = (event) => {
    setSelectedUbicacion(event.target.value);
  };
  //
  const encargado = useRef({});
  let dataEncargado = "";

  function borrarEncargado(e) {
    e.preventDefault();
    encargado.current.clear();
  }
  function guardarEncargado(e) {
    e.preventDefault();
    dataEncargado = encargado.current.toDataURL();
  }
  //
  const responsable = useRef({});
  let dataResponsable = "";

  function borrarResponsable(e) {
    e.preventDefault();
    responsable.current.clear();
  }
  function guardarResponsable(e) {
    e.preventDefault();
    dataResponsable = responsable.current.toDataURL();
  }

  const selectedEquipoId =
    selectedEquipo.trim().length > 0
      ? equipos.find(
          (equipo) => equipo.attributes.descripcion === selectedEquipo
        )?.id || ""
      : "";

  const selectedResponsableId =
    selectedResponsable.trim().length > 0
      ? tecnicos.find(
          (tecnico) => tecnico.attributes.nombreCompleto === selectedResponsable
        )?.id || ""
      : "";
  const selectedSupervisorId =
    selectedSupervisor.trim().length > 0
      ? tecnicos.find(
          (tecnico) => tecnico.attributes.nombreCompleto === selectedSupervisor
        )?.id || ""
      : "";
  const selectedUbicacionId =
    selectedUbicacion.trim().length > 0
      ? ubicaciones.find(
          (ubicacion) => ubicacion.attributes.descripcion === selectedUbicacion
        )?.id || ""
      : "";

  const submit = (data) => {
    if (dataResponsable == "" || dataEncargado == "") {
      Swal.fire({
        icon: "error",
        title: "Faltan Firmas",
        confirmButtonColor: "#1976d2",
      });
    } else {
      const dataJson = {
        data: {
          fechaEntrega: data.fechaEntrega,
          equipo: {
            id: selectedEquipoId,
          },
          serie: data.serie,
          ubicacion: {
            id: selectedUbicacionId,
          },
          responsable: {
            id: selectedResponsableId,
          },
          supervisor: {
            id: selectedSupervisorId,
          },
          motivo: data.motivo,
          fechaDevolucion: data.fechaDevolucion,
          firmaResponsable: dataResponsable,
          firmaEncargado: dataEncargado,
        },
      };
      axios
        .post(`${page}/api/fichas`, dataJson, config)
        .then(() => {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });

          Toast.fire({
            icon: "success",
            title: "Datos ingresados",
          });
        })
        .catch(function (error) {
          console.log(error);
        });
      reset();
      encargado.current.clear();
      responsable.current.clear();
      setSelectedEquipo("");
      setSelectedResponsable("");
      setSelectedSupervisor("");
      setSelectedUbicacion("");
      setTimeout(() => {
        navigate("/consultar");
      }, 2500);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", margin: 5 }}>
      <form style={{ maxWidth: 800 }} onSubmit={handleSubmit(submit)}>
        <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
          <img src={logo} alt="Logo" style={{ maxHeight: 60 }} />{" "}
          <div>
            <h2 style={{ margin: 0 }}>Hoja de Responsabilidad</h2>
          </div>
        </div>

        <hr style={{ margin: 0 }} />
        <p style={{ textAlign: "end", margin: 0 }}>
          Fecha de entrega:{" "}
          <input
            style={{ height: 25, border: "1px solid black", borderRadius: 5 }}
            id="fechaEntrega"
            {...register("fechaEntrega", { required: true })}
            type="date"
          />
        </p>
        <p style={{ marginTop: 5, textAlign: "start" }}>A quien corresponda:</p>
        <div className="container">
          <p style={{ margin: 5, textAlign: "start" }}>
            Yo:{" "}
            <input
              id="selectResponsable"
              {...register("responsable", { required: true })}
              list="tecnicos"
              onChange={handleChange}
              value={selectedResponsable}
            />
            <datalist id="tecnicos">
              {tecnicos.map((tecnico) => (
                <option
                  key={tecnico?.id}
                  value={tecnico.attributes.nombreCompleto}
                ></option>
              ))}
            </datalist>
            recibí de bodega el equipo de trabajo que se menciona a
            continuación:
          </p>
          <p style={{ margin: 5, textAlign: "start" }}>
            Autorizado por:{" "}
            <input
              id="selectSupervisor"
              {...register("supervisor", { required: true })}
              list="tecnicos"
              onChange={handleSupervisor}
              value={selectedSupervisor}
            />
            <datalist id="tecnicos">
              {tecnicos.map((tecnico) => (
                <option
                  key={tecnico?.id}
                  value={tecnico.attributes.nombreCompleto}
                ></option>
              ))}
            </datalist>
          </p>
        </div>
        <div className="container">
          <p style={{ margin: 5, textAlign: "start" }}>
            Equipo o herramienta:{" "}
            <input
              id="selectEquipo"
              {...register("equipo", { required: true })}
              list="equipos"
              onChange={handleEquipo}
              value={selectedEquipo}
            />
            <datalist id="equipos">
              {equipos.map((equipo) => (
                <option
                  key={equipo?.id}
                  value={equipo.attributes.descripcion}
                ></option>
              ))}
            </datalist>
          </p>
          <p style={{ margin: 5, textAlign: "start" }}>
            Número de serie:{" "}
            <textarea
              style={{ height: 15 }}
              id="serie"
              {...register("serie", { required: true })}
              type="text"
            />
          </p>
          <p style={{ margin: 5, textAlign: "start" }}>
            Ubicación:{" "}
            <input
              id="selectEmpleado"
              {...register("empleado", { required: true })}
              list="ubicacion"
              onChange={handleUbicacion}
              value={selectedUbicacion}
            />
            <datalist id="ubicacion">
              {ubicaciones.map((ubicacion) => (
                <option
                  key={ubicacion?.id}
                  value={ubicacion.attributes.descripcion}
                ></option>
              ))}
            </datalist>
          </p>
          <p style={{ margin: 5, textAlign: "start" }}>
            Motivo de prestamo:{" "}
            <textarea
              style={{ height: 15, textAlign: "right" }}
              id="motivo"
              {...register("motivo", { required: true })}
              type="text"
            />
          </p>
          <p style={{ margin: 0, textAlign: "justify" }}>
            El cual se me hace entrega en óptimas condiciones para su debido
            uso, comprometiendome a cuidarlo, mantener en buen estado y
            utilizarlo única y exclusivamente para asuntos relacionados con mi
            actividad laboral.
          </p>
        </div>
        <div
          className="containerFirmas"
          // style={{
          //   display: "flex",
          //   flexDirection: "column",
          //   gap: 10,
          //   marginTop: 20,
          //   justifyContent: "space-around",
          // }}
        >
          <div
            style={{
              width: 200,
              borderWidth: 1,
              borderStyle: "solid",
              borderRadius: 10,
              alignSelf: "center",
            }}
          >
            <label htmlFor="">Firma Responsable(a)</label>
            <SignatureCanvas
              ref={responsable}
              penColor="black"
              canvasProps={{
                height: 100,
                className: "sigCanvas",
                width: "200%",
              }}
            />
            <button className="btn" onClick={borrarResponsable}>
              Borrar
            </button>
            <button className="btn" onClick={guardarResponsable}>
              Guardar
            </button>
          </div>
          <div
            style={{
              width: 200,
              borderWidth: 1,
              borderStyle: "solid",
              borderRadius: 10,
              alignSelf: "center",
            }}
          >
            <label htmlFor="">Firma Encargado(a)</label>
            <SignatureCanvas
              ref={encargado}
              penColor="black"
              canvasProps={{
                height: 100,
                className: "sigCanvas",
                width: "200%",
              }}
            />
            <button className="btn" onClick={borrarEncargado}>
              Borrar
            </button>
            <button className="btn" onClick={guardarEncargado}>
              Guardar
            </button>
          </div>
        </div>
        <input
          className="botones"
          value={"ENVIAR"}
          style={{
            marginTop: 20,
            backgroundColor: "#1976d2",
            padding: 10,
            borderRadius: 5,
            borderWidth: 1,
            cursor: "pointer",
            color: "white",
            fontWeight: "bold",
          }}
          type="submit"
        />
      </form>
    </div>
  );
}

export default CrearFicha;
