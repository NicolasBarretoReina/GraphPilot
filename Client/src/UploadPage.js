import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UploadPage() {
  const [file, setFile] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('archivo', file);

    try {
      const res = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      setMensaje(data.mensaje);

      if (res.ok) {
        // Redirigir a /resultados después de subir el archivo exitosamente
        navigate('/resultados');
      }
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      setMensaje('Error al subir el archivo');
    }
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

export default UploadPage;