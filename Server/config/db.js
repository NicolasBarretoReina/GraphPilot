const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: ""
});

db.connect((err) => {
    if (err) {
        console.error("Error conectando a la base de datos:", err);
    } else {
        console.log("Conectado a la base de datos MySQL");
    }
});

module.exports = db;