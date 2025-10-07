import React from "react";
import Navbar from "../Navbar/Navbar";
import { useLocation } from 'react-router-dom';

function Rutas() {
  const location = useLocation();
  const id = location.state?.id || 'Error';

  return (
    <div>
      <Navbar />
      <div style={{ padding: "1rem" }}>
        <h1>Vista de rutas</h1>
        <p>ID de la ruta: {id}</p>

        <h2>Estamos aquí 📍</h2>
        <iframe
          title="Mapa de mi empresa"
          width="100%"
          height="450"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDweMw_Hma8bz1QW75dvgWX6aCOYIA_TpA&q=Valparaíso,Chile"
        ></iframe>
      </div>
    </div>
  );
}

export default Rutas;
