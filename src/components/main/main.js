import Navbar from "../Navbar/Navbar";
import { useLocation } from 'react-router-dom';

function Main() {
  const location = useLocation();
  const Id = location.state?.id || 'Error';

  return (
    <div>
      <Navbar />
      <h1>Hola usuario con ID: {Id}</h1>
    </div>
  );
}

export default Main;

