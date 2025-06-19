import { useEffect, useState } from 'react';
import axios from 'axios';

function Result() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/consultar')
      .then(res => setDatos(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Resultados de la consulta:</h2>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombres</th>
            <th>Rol</th>
            <th>Experiencia</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((item, index) => (
            <tr key={index}>
              <td>{item.Id}</td>
              <td>{item.Nombres}</td>
              <td>{item.Rol}</td>
              <td>{item.Experiencia}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Result;