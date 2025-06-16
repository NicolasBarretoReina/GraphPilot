const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const graphRoutes = require('./routes/Graph');
app.use('/', graphRoutes);

app.listen(3001, () => {
  console.log('Servidor corriendo en http://localhost:3001');
});