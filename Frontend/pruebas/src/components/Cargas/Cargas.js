import Navbar from "../Navbar/Navbar";

function Cargas() {
  return (
    <div>
      <Navbar />
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '32px 24px',
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#2c3e50',
          marginBottom: '8px',
        }}>
          � Gestión de Cargas
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#7f8c8d',
        }}>
          Módulo de cargas en construcción...
        </p>
      </div>
    </div>
  );
}

export default Cargas;
