import { useEffect, useState } from 'react';

function App() {
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/prueba')
      .then(res => res.json())
      .then(data => setMensaje(data.mensaje));
  }, []);

  return (
    <div>
      <h1>Gráficos generados</h1>
    </div>
  );
}

export default App;