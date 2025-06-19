// Server/routes/Graph.js
const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Ejemplo de consulta
router.get('/consultar', (req, res) => {
  const query = 'SELECT * FROM pruebas_bloque1'; // reemplaza con tu tabla real

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error al realizar la consulta:', err);
      res.status(500).json({ error: 'Error en la consulta' });
    } else {
      res.json(results);
    }
  });
});

module.exports = router;