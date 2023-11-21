import { Button, Grid, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import { DataGrid, esES } from "@mui/x-data-grid";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Modal from "@mui/material/Modal";
import { useForm } from "react-hook-form";

const columns = [
  {
    field: "descripcion",
    headerName: "Descripción",
    minWidth: "90%",
    valueGetter: (equipos) => equipos.row.attributes.descripcion,
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

function Equipos() {
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
      .get(`${page}/api/equipos/${rowText}`, config)
      .then((res) => setDescActualizar(res.data.data.attributes.descripcion))
      .catch(function (error) {
        console.log(error);
      });
    setOpen2(true);
  };
  const handleClose = () => setOpen(false);
  const handleClose2 = () => setOpen2(false);

  const [equipos, setEquipos] = useState([]);
  const token = localStorage.getItem("token");
  const [rowSelected, setRowSelected] = useState([]);

  const config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const update = () => {
    axios
      .get(`${page}/api/equipos?filters[estado][$eq]=true`, config)
      .then((res) => setEquipos(res.data.data))
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get(`${page}/api/equipos?filters[estado][$eq]=true`, config)
      .then((res) => setEquipos(res.data.data))
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
      .put(`${page}/api/equipos/${rowText}`, dataJson, config)
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
      .post(`${page}/api/equipos`, dataJson, config)
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
      .put(`${page}/api/equipos/${rowText}`, dataJson, config)
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
          rows={equipos}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          loading={!equipos.length}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          onRowSelectionModelChange={(data) => {
            setRowSelected(data);
          }}
        />
      </Grid>
    </>
  );
}

export default Equipos;
