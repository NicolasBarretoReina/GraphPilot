// backend/index.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const foodRoutes = require('./routes/foodRoutes');
const menuRoutes = require('./routes/menuRoutes');
const assistRoutes = require('./routes/assistRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const wasteRoutes = require('./routes/wasteRoutes');
const totallunchesRoutes = require('./routes/totallunchesRoutes')

app.use('/', authRoutes);


app.listen(3001, () => {
    console.log("Server is running on port 3001");
});

process.on('SIGINT', () => {
    db.end(err => {
        if (err) {
            console.error("Error al cerrar la conexión a la base de datos: ", err);
        } else {
            console.log("Conexión a la base de datos cerrada");
        }
        process.exit();
    });
});