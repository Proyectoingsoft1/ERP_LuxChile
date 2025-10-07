import Navbar from "../Navbar/Navbar";
import { useLocation } from 'react-router-dom';

function Bodegas() {
  const location = useLocation();
  const id = location.state?.id || 'Error';

  return (
    <div>
      <Navbar />
      <h1>Lista Bodegas</h1>
    </div>
  );
}

export default Bodegas;