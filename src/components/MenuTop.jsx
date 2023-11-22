import logoInicio from "../assets/iungo.png";
import { useNavigate } from "react-router-dom";

function MenuTop() {
    const navigate = useNavigate();
  return (
    <div>
      <img src={logoInicio} alt="Logo" onClick={() => {
            navigate("/menu");
          }} style={{cursor: "pointer"}}/>
    </div>
  )
}

export default MenuTop
