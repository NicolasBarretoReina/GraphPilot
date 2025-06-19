// src/components/NavBar.js
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav style={{ padding: '1rem', backgroundColor: '#f0f0f0' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>📤 Subir Archivo</Link>
      <Link to="/result">📊 Ver Resultados</Link>
    </nav>
  );
}

export default NavBar;