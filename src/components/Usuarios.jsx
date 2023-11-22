import * as React from "react";
import { Button, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import { DataGrid, esES } from "@mui/x-data-grid";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Modal from "@mui/material/Modal";
import { useForm } from "react-hook-form";
import MenuTop from "./MenuTop";
// import MenuTop from "./MenuTop";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "username",
    headerName: "Usuario",
    width: 200,
  },
  {
    field: "email",
    headerName: "Correo",
    width: 300,
  },
];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Usuarios() {
  const { register, handleSubmit } = useForm();

  const page = "http://localhost:1337";

  //modal
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const [updUser, setUpdUser] = useState("");
  const [updCorreo, setUpdCorreo] = useState("");
  const handleOpen2 = () => {
    const rowText = rowSelected.toString();
    axios
      .get(`${page}/api/users/${rowText}`, config)
      .then((res) => {
        setUpdUser(res.data.username);
        setUpdCorreo(res.data.email);
      })
      .catch(function (error) {
        console.log(error);
      });
    setOpen2(true);
  };

  const handleClose = () => setOpen(false);
  const handleClose2 = () => setOpen2(false);

  const [usuarios, setUsuarios] = useState([]);
  const token = localStorage.getItem("token");
  const [rowSelected, setRowSelected] = useState([]);

  const config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const update = () => {
    axios
      .get(`${page}/api/users?filters[blocked][$eq]=false`, config)
      .then((res) => setUsuarios(res.data))
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get(`${page}/api/users?populate=*&filters[blocked][$eq]=false`, config)
      .then((res) => setUsuarios(res.data))
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const borrar = () => {
    const rowText = rowSelected.toString();
    const dataJson = {
      blocked: true,
    };

    axios
      .put(`${page}/api/users/${rowText}`, dataJson, config)
      .then(() => update())
      .catch(function (error) {
        console.log(error);
      });
  };
  const submit = (data) => {
    const userTexto = data.identifierUser;
    const emailTexto = data.identifierEmail;
    const passTexto = data.identifierPassword;

    console.log(data);

    const dataJson = {
      username: userTexto,
      email: emailTexto,
      password: passTexto,
    };

    axios
      .post(`${page}/api/auth/local/register`, dataJson)
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
    const userTexto = data.identifierUser;
    const emailTexto = data.identifierEmail;
    const passTexto = data.identifierPassword;
    const rowText = rowSelected.toString();

    const dataJson = {
      username: userTexto,
      email: emailTexto,
      password: passTexto,
    };
    axios
      .put(`${page}/api/users/${rowText}`, dataJson, config)
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
      <MenuTop />

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
                  style={{ marginBottom: 10 }}
                  id="username"
                  label="Usuario"
                  variant="outlined"
                  type="text"
                  {...register("identifierUser", { required: true })}
                />
                <TextField
                  style={{ marginBottom: 10 }}
                  id="email"
                  label="Correo Electronico"
                  variant="outlined"
                  type="email"
                  {...register("identifierEmail", { required: true })}
                />
                <TextField
                  id="password"
                  label="Contraseña"
                  variant="outlined"
                  type="password"
                  {...register("identifierPassword", { required: true })}
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
                  helperText={updUser}
                  id="username"
                  label="Usuario"
                  variant="outlined"
                  type="text"
                  {...register("identifierUser")}
                />
                <TextField
                  helperText={updCorreo}
                  id="email"
                  label="Correo Electronico"
                  variant="outlined"
                  type="email"
                  {...register("identifierEmail")}
                />
                <TextField
                  id="password"
                  label="Contraseña"
                  variant="outlined"
                  type="password"
                  {...register("identifierPassword")}
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
          </Box>
        </Modal>
        <DataGrid
          style={{ marginTop: 10 }}
          rows={usuarios}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          loading={!usuarios.length}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          onRowSelectionModelChange={(data) => {
            setRowSelected(data);
          }}
        />
      </Box>
    </>
  );
}
