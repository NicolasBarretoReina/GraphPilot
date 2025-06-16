import { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('archivo', file);

    const res = await fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    setMensaje(data.mensaje);
  };

  return (
    <div>
      <h1>Subir archivo</h1>
      <input type="file" accept=".csv, .xlsx" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Subir</button>
      <p>{mensaje}</p>
    </div>
  );
}

export default App;