import Navbar from "../Navbar/Navbar";
import { useLocation } from 'react-router-dom';

function Rutas() {
  const location = useLocation();
  const id = location.state?.id || 'Error';

  return (
    <div>
      <Navbar />
      <h1>Vista de rutas</h1>
    </div>
  );
}

export default Rutas;