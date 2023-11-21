import './App.css'
import { HashRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login'
import ProtectedRoutes from './components/ProtectedRoutes';
import Menu from './components/Menu';

function App() {


  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
        <Route path="/menu" element={<Menu />} />

        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
