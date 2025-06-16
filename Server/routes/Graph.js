const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/upload', upload.single('archivo'), (req, res) => {
  const ruta = path.resolve(req.file.path); // Ruta absoluta para Windows
  const python = spawn('python', ['scripts/process.py', ruta]);

  let output = '';
  let errorOutput = '';

  python.stdout.on('data', data => {
    output += data.toString();
  });

  python.stderr.on('data', data => {
    errorOutput += data.toString();
  });

  python.on('close', code => {
    if (code === 0) {
      console.log('Salida del script:', output);
      res.json({ mensaje: 'Archivo procesado correctamente', salida: output.trim() });
    } else {
      console.error('Error del script:', errorOutput);
      res.status(500).json({ mensaje: 'Error al procesar el archivo', error: errorOutput.trim() });
    }
  });
});

module.exports = router;