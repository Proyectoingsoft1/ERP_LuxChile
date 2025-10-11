import React, { useEffect, useRef, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { useLocation } from 'react-router-dom';

function Rutas() {
  const location = useLocation();
  const id = location.state?.id || 'Error';
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [ubicacionActual, setUbicacionActual] = useState(null);
  const [origenKey, setOrigenKey] = useState("actual");
  const [destinoKey, setDestinoKey] = useState("");
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  const ubicaciones = {
    "valparaiso": { lat: -33.0458, lng: -71.6197 },
    "santiago": { lat: -33.4489, lng: -70.6693 },
    "la_serena": { lat: -29.9045, lng: -71.2489 }
  };

  useEffect(() => {
    if (!window.google || map || ubicacionActual) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const actual = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUbicacionActual(actual);

        const newMap = new window.google.maps.Map(mapRef.current, {
          center: actual,
          zoom: 13,
        });

        const renderer = new window.google.maps.DirectionsRenderer();
        renderer.setMap(newMap);

        setMap(newMap);
        setDirectionsRenderer(renderer);
      },
      (error) => {
        console.error("Error obteniendo ubicación:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [map, ubicacionActual]);

  const calcularRuta = () => {
    if (!map || !directionsRenderer || !destinoKey) return;

    const directionsService = new window.google.maps.DirectionsService();

    const origen =
      origenKey === "actual"
        ? ubicacionActual
        : ubicaciones[origenKey];

    const destino = ubicaciones[destinoKey];

    if (!origen || !destino) return;

    directionsService.route(
      {
        origin: origen,
        destination: destino,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
        } else {
          console.error("Error al calcular ruta:", status);
        }
      }
    );
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "1rem" }}>
        <h1>Vista de rutas</h1>
        <p>ID usuario: {id}</p>

        <h2>Selecciona origen y destino</h2>

        <div style={{ marginBottom: "1rem" }}>
          <label><strong>Origen:</strong></label>
          <select value={origenKey} onChange={(e) => setOrigenKey(e.target.value)}>
            <option value="actual">Ubicación actual</option>
            <option value="valparaiso">Valparaíso</option>
            <option value="santiago">Santiago</option>
            <option value="la_serena">La Serena</option>
          </select>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label><strong>Destino:</strong></label>
          <select value={destinoKey} onChange={(e) => setDestinoKey(e.target.value)}>
            <option value="">-- Selecciona destino --</option>
            <option value="valparaiso">Valparaíso</option>
            <option value="santiago">Santiago</option>
            <option value="la_serena">La Serena</option>
          </select>
        </div>

        <button onClick={calcularRuta} disabled={!destinoKey}>
          Calcular ruta
        </button>

        <div
          ref={mapRef}
          style={{ width: "100%", height: "450px", marginTop: "1rem", borderRadius: "8px" }}
        />
      </div>
    </div>
  );
}

export default Rutas;
