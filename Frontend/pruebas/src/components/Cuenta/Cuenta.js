import Navbar from "../Navbar/Navbar";
import { useLocation } from 'react-router-dom';

function Cuentas() {
  const location = useLocation();
  const id = location.state?.id || 'Error';

  return (
    <div>
      <Navbar />
      <h1>Configuracion cuenta</h1>
    </div>
  );
}

export default Cuentas;