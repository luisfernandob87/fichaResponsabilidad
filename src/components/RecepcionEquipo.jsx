import Box from "@mui/material/Box";
import { DataGrid, esES, GridToolbar } from "@mui/x-data-grid";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { Button, Grid, Modal } from "@mui/material";
import moment from "moment";
import "moment/locale/es";
import MenuTop from "./MenuTop";
import { useForm } from "react-hook-form";
moment.locale("es");

const columns = [
  { field: "id", headerName: "ID", width: 75, headerAlign: "center" },
  {
    field: "fechaEntrega",
    headerName: "Fecha de Entrega",
    width: 150,
    valueGetter: (fichas) =>
      moment(fichas.row.attributes.fechaEntrega).format("DD/MM/YYYY"),
    headerAlign: "center",
  },
  {
    field: "equipo",
    headerName: "Equipo",
    width: 150,
    valueGetter: (fichas) =>
      fichas.row.attributes.equipo.data.attributes.descripcion,
    headerAlign: "center",
  },
  {
    field: "serie",
    headerName: "Serie",
    width: 150,
    valueGetter: (fichas) => fichas.row.attributes.serie,
    headerAlign: "center",
  },
  {
    field: "ubicacion",
    headerName: "Ubicación",
    width: 150,
    valueGetter: (fichas) =>
      fichas.row.attributes.ubicacion.data.attributes.descripcion,
    headerAlign: "center",
  },
  {
    field: "responsable",
    headerName: "Responsable",
    width: 150,
    valueGetter: (fichas) =>
      fichas.row.attributes.responsable.data.attributes.nombreCompleto,
    headerAlign: "center",
  },
  {
    field: "supervisor",
    headerName: "Supervisor",
    width: 150,
    valueGetter: (fichas) =>
      fichas.row.attributes.supervisor.data.attributes.nombreCompleto,
    headerAlign: "center",
  },
  {
    field: "motivo",
    headerName: "Motivo",
    width: 150,
    valueGetter: (fichas) => fichas.row.attributes.motivo,
    headerAlign: "center",
  },
  {
    field: "fechaDevolucion",
    headerName: "Fecha de Devolución",
    width: 150,
    valueGetter: (fichas) =>
      fichas.row.attributes.fechaDevolucion == null
        ? "Pendiente"
        : moment(fichas.row.attributes.fechaDevolucion).format("DD/MM/YYYY"),
    headerAlign: "center",
  },
];

function RecepcionEquipo() {
  const { register, handleSubmit } = useForm();

  const [fichas, setFichas] = useState([]);
  const [rowSelected, setRowSelected] = useState([]);
  const token = localStorage.getItem("token");

  const page = "http://localhost:1337";

  const config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  useEffect(() => {
    axios
      .get(
        `${page}/api/fichas?filters[fechaDevolucion][$notNull]&populate=*`,
        config
      )
      .then((res) => setFichas(res.data.data))
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  const update = () => {
    axios
      .get(
        `${page}/api/fichas?filters[fechaDevolucion][$notNull]&populate=*`,
        config
      )
      .then((res) => setFichas(res.data.data))
      .catch(function (error) {
        console.log(error);
      });
  };

  const [sortModel, setSortModel] = useState([
    {
      field: "id",
      sort: "desc",
    },
  ]);

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

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

  const handleOpen = () => {
    setOpen(true);
  };
  const updRegistro = (data) => {
    const rowText = rowSelected.toString();
    const dataJson = {
      data: {
        fechaDevolucion: data.fechaDevolucion,
      },
    };
    axios
      .put(`${page}/api/fichas/${rowText}`, dataJson, config)
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

  return (
    <div>
      <MenuTop />
      <Box sx={{ height: 450, width: "100%" }}>
        <Button variant="contained" onClick={handleOpen}>
          Entrega
        </Button>
        <DataGrid
          style={{ marginTop: 10 }}
          rows={fichas}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 20,
              },
            },
          }}
          sortModel={sortModel}
          pageSizeOptions={[20]}
          loading={!fichas.length}
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Grid sx={style}>
          <form onSubmit={handleSubmit(updRegistro)}>
            <div>
              <input
                style={{
                  height: 25,
                  width: 200,
                  border: "1px solid black",
                  borderRadius: 5,
                }}
                id="fechaDevolucion"
                {...register("fechaDevolucion")}
                type="date"
              />
            </div>
            <Button variant="contained" type="submit" style={{ marginTop: 10 }}>
              Guardar
            </Button>
          </form>
        </Grid>
      </Modal>
    </div>
  );
}

export default RecepcionEquipo;
