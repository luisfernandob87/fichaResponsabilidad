import * as React from "react";
import {
  Button,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar, esES } from "@mui/x-data-grid";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Modal from "@mui/material/Modal";
import { useForm } from "react-hook-form";
import MenuTop from "./MenuTop";
const columns = [
  {
    field: "nombreCompleto",
    headerName: "Nombre Completo",
    width: 300,
    valueGetter: (tecnicos) =>
      tecnicos.row.attributes.nombreCompleto,
  },
  {
    field: "correo",
    headerName: "Correo",
    width: 300,
    valueGetter: (tecnicos) =>
      tecnicos.row.attributes.correo,
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

export default function Tecnicos() {
  const { register, handleSubmit } = useForm();

   const page = "http://localhost:1337";

  //modal
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const [updNombre, setUpdNombre] = useState("");
  const [updCorreo, setUpdCorreo] = useState("");
  const handleOpen2 = () => {
    const rowText = rowSelected.toString();
    axios
      .get(`${page}/api/tecnicos/${rowText}/?populate=*`, config)
      .then((res) => 
       {
         setUpdNombre(res.data.data.attributes.nombreCompleto);
         setUpdCorreo(res.data.data.attributes.correo);
       }
      )
      .catch(function (error) {
        console.log(error);
      });
    setOpen2(true);
    console.log(updCorreo);
  };
  const handleClose = () => setOpen(false);
  const handleClose2 = () => setOpen2(false);
  const [correo, setCorreo] = useState([]);

  const [tecnicos, setTecnicos] = useState([]);
  const token = localStorage.getItem("token");
  const [rowSelected, setRowSelected] = useState([]);

  const config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const update = () => {
    axios
      .get(`${page}/api/tecnicos?populate=*&filters[estado][$eq]=true`, config)
      .then((res) => setTecnicos(res.data.data))
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get(`${page}/api/tecnicos?populate=*&filters[estado][$eq]=true`, config)
      .then((res) => setTecnicos(res.data.data))
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
      .put(`${page}/api/tecnicos/${rowText}`, dataJson, config)
      .then(() => update())
      .catch(function (error) {
        console.log(error);
      });
  };
  const submit = (data) => {
 
    const nameTexto = data.nombreCompleto;
    const correoTexto = data.correo;

    const dataJson = {
      data: {
        nombreCompleto: nameTexto,
        correo: correoTexto
       },
    };
    axios
      .post(`${page}/api/tecnicos`, dataJson, config)
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
    const nameTexto = data.nombreCompleto;
    const correoTexto = data.correo;

    const rowText = rowSelected.toString();
    const dataJson = {
      data: {
        nombreCompleto: nameTexto,
        correo: correoTexto
      },
    };

    axios
      .put(`${page}/api/tecnicos/${rowText}`, dataJson, config)
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
  const [sortModel, setSortModel] = useState([
    {
      field: "nombreCompleto",
      sort: "asc",
    },
  ]);
  return (
    <>
    <MenuTop/>
      <Box sx={{ height: 375, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <Button
            variant={"contained"}
            onClick={handleOpen}
          >
            Crear
          </Button>
          <Button
            variant={"contained"}
            onClick={handleOpen2}
          >
            Actualizar
          </Button>
          <Button
            variant={"contained"}
            onClick={borrar}
          >
            Borrar
          </Button>
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <form onSubmit={handleSubmit(submit)}>
              <div>
                <TextField
                  style={{ width: "100%", marginBottom: 10 }}
                  id="nombreCompleto"
                  label="Nombre Completo"
                  variant="outlined"
                  type="text"
                  {...register("nombreCompleto", { required: true })}
                />

                  <TextField
                    style={{ width: "100%", marginBottom: 10 }}
                    id="correo"
                    label="Correo"
                    variant="outlined"
                    type="text"
                    {...register("correo", { required: true })}
                  >
                  </TextField>

              </div>
              <Button
                variant="contained"
                type="submit"
                style={{ marginTop: 10 }}
              >
                Crear
              </Button>
            </form>
          </Box>
        </Modal>
        <Modal
          open={open2}
          onClose={handleClose2}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <form onSubmit={handleSubmit(updRegistro)}>
              <div>
                <TextField
                  helperText={updNombre}
                  style={{ width: "100%", marginBottom: 10 }}
                  id="nombreCompleto"
                  label="Nombre Completo"
                  variant="outlined"
                  type="text"
                  {...register("nombreCompleto", { required: true })}
                />
              </div>
                <TextField
                  helperText={updCorreo}
                  style={{ width: "100%", marginBottom: 10 }}
                  id="correo"
                  label="Correo"
                  variant="outlined"
                  type="text"
                  {...register("correo", { required: true })}
                />
              <Button
                variant="contained"
                type="submit"
                style={{ marginTop: 10 }}
              >
                Actualizar
              </Button>
            </form>
          </Box>
        </Modal>
        <DataGrid
          style={{ marginTop: 10 }}
          rows={tecnicos}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          sortModel={sortModel}
          pageSizeOptions={[10]}
          loading={!tecnicos.length}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          onRowSelectionModelChange={(data) => {
            setRowSelected(data);
          }}
          slots={{ toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              printOptions: { disableToolbarButton: true },
              showQuickFilter: true,
            },
          }}
        />
      </Box>
    </>
  );
}
