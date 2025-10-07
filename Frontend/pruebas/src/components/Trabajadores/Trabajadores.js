import Navbar from "../Navbar/Navbar";
import { useLocation } from 'react-router-dom';

function Trabajadores() {
  const location = useLocation();
  const id = location.state?.id || 'Error';

  return (
    <div>
      <Navbar />
      <h1>Vista de asociacion de carga a trabajadores {id}</h1>
    </div>
  );
}

export default Trabajadores;