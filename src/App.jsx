import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Menu from "./components/Menu";
import Equipos from "./components/Equipos";
import Tecnicos from "./components/Tecnicos";
import Ubicacion from "./components/Ubicacion";
import Ficha from "./components/Ficha";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route element={<ProtectedRoutes />}> */}
        <Route path="/menu" element={<Menu />} />
        <Route path="/equipos" element={<Equipos />} />
        <Route path="/tecnicos" element={<Tecnicos />} />
        <Route path="/ubicacion" element={<Ubicacion />} />
        <Route path="/ficha" element={<Ficha />} />

        {/* </Route> */}
      </Routes>
    </HashRouter>
  );
}

export default App;
