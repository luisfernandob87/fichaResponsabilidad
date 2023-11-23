import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Menu from "./components/Menu";
import Equipos from "./components/Equipos";
import Tecnicos from "./components/Tecnicos";
import Ubicacion from "./components/Ubicacion";
import Ficha from "./components/Ficha";
import Usuarios from "./components/Usuarios";
import CrearFicha from "./components/CrearFicha";
import ConsultarFicha from "./components/ConsultarFicha";
import DetalleFicha from "./components/DetalleFicha";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
        <Route path="/menu" element={<Menu />} />
        <Route path="/equipos" element={<Equipos />} />
        <Route path="/tecnicos" element={<Tecnicos />} />
        <Route path="/ubicacion" element={<Ubicacion />} />
        <Route path="/ficha" element={<Ficha />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/crear" element={<CrearFicha />} />
        <Route path="/consultar" element={<ConsultarFicha />} />
        <Route path="/detalleFicha" element={<DetalleFicha />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
