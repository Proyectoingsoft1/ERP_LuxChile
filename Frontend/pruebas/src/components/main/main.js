import Navbar from "../Navbar/Navbar";
import { useLocation } from 'react-router-dom';
import TokenDebug from "../Login/TokenDebug";

function Main() {
  const location = useLocation();
  const Id = location.state?.id || 'Error';

  return (
    <div>
      <Navbar />
      <h1>Hola usuario con ID: {Id}</h1>
      
      {/* SCRUM-77: Mostrar que el token está guardado */}
      <TokenDebug />
    </div>
  );
}

export default Main;
