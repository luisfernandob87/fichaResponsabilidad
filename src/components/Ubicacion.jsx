import { Button, Grid, TextField } from "@mui/material";
import { DataGrid, esES } from "@mui/x-data-grid";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Modal from "@mui/material/Modal";
import { useForm } from "react-hook-form";
import MenuTop from "./MenuTop";

const columns = [
  {
    field: "ubicacion",
    headerName: "Ubicación",
    width: 600,
    valueGetter: (ubicacion) => ubicacion.row.attributes.descripcion,
  },
];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Ubicacion() {
  const { register, handleSubmit } = useForm();

  const page = "http://localhost:1337";

  //modal
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const handleOpen = () => setOpen(true);
  const [descActualizar, setDescActualizar] = useState("");
  const handleOpen2 = () => {
    const rowText = rowSelected.toString();
    axios
      .get(`${page}/api/ubicacions/${rowText}`, config)
      .then((res) => setDescActualizar(res.data.data.attributes.descripcion))
      .catch(function (error) {
        console.log(error);
      });
    setOpen2(true);
  };
  const handleClose = () => setOpen(false);
  const handleClose2 = () => setOpen2(false);

  const [ubicacion, setUbicacion] = useState([]);
  const token = localStorage.getItem("token");
  const [rowSelected, setRowSelected] = useState([]);

  const config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const update = () => {
    axios
      .get(`${page}/api/ubicacions?filters[estado][$eq]=true`, config)
      .then((res) => setUbicacion(res.data.data))
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get(`${page}/api/ubicacions?filters[estado][$eq]=true`, config)
      .then((res) => setUbicacion(res.data.data))
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const borrar = () => {
    const rowText = rowSelected.toString();
    const dataJson = {
      data: {
        estado: false,
      },
    };
    axios
      .put(`${page}/api/ubicacions/${rowText}`, dataJson, config)
      .then(() => update())
      .catch(function (error) {
        console.log(error);
      });
  };
  const submit = (data) => {
    const descTexto = data.identifier;
    const dataJson = {
      data: {
        descripcion: descTexto,
      },
    };
    axios
      .post(`${page}/api/ubicacions`, dataJson, config)
      .then(() => {
        handleClose(false);
        update();
      })
      .catch((error) => {
        if (error.response.status === 404) {
          alert(error);
        }
      });
  };

  const updRegistro = (data) => {
    const rowText = rowSelected.toString();
    const descTexto = data.identifier;
    const dataJson = {
      data: {
        descripcion: descTexto,
      },
    };
    axios
      .put(`${page}/api/ubicacions/${rowText}`, dataJson, config)
      .then(() => {
        handleClose2(false);
        update();
      })
      .catch((error) => {
        if (error.response.status === 404) {
          alert(error);
        }
      });
  };

  return (
    <>
    <MenuTop/>
      <Grid sx={{ height: 400, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <Button variant={"contained"} onClick={handleOpen}>
            Crear
          </Button>
          <Button variant={"contained"} onClick={handleOpen2}>
            Actualizar
          </Button>
          <Button variant={"contained"} onClick={borrar}>
            Borrar
          </Button>
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Grid sx={style}>
            <form onSubmit={handleSubmit(submit)}>
              <div>
                <TextField
                  id="descripcion"
                  label="Descripción"
                  variant="outlined"
                  type="text"
                  {...register("identifier", { required: true })}
                />
              </div>
              <Button
                variant="contained"
                type="submit"
                style={{ marginTop: 10 }}
              >
                Crear
              </Button>
            </form>
          </Grid>
        </Modal>
        <Modal
          open={open2}
          onClose={handleClose2}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Grid sx={style}>
            <form onSubmit={handleSubmit(updRegistro)}>
              <div>
                <TextField
                  helperText={descActualizar}
                  id="descripcion"
                  label="Descripción"
                  variant="outlined"
                  type="text"
                  {...register("identifier")}
                />
              </div>
              <Button
                variant="contained"
                type="submit"
                style={{ marginTop: 10 }}
              >
                Actualizar
              </Button>
            </form>
          </Grid>
        </Modal>
        <DataGrid
          style={{ marginTop: 10 }}
          rows={ubicacion}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          loading={!ubicacion.length}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          onRowSelectionModelChange={(data) => {
            setRowSelected(data);
          }}
        />
      </Grid>
    </>
  );
}

export default Ubicacion;
