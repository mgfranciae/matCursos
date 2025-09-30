const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const multer = require('multer');
const fs = require('fs');

// Cargar variables de entorno
dotenv.config();
console.log('Variables de entorno cargadas:', {
  PORT: process.env.PORT,
  UPLOAD_DIR: process.env.UPLOAD_DIR,
  OUTPUT_DIR: process.env.OUTPUT_DIR
});

// Validar variables de entorno
if (!process.env.UPLOAD_DIR || !process.env.OUTPUT_DIR) {
  console.error('Error: UPLOAD_DIR y OUTPUT_DIR deben estar definidos en .env');
  process.exit(1);
}

// Asegurar que las carpetas existan
[process.env.UPLOAD_DIR, process.env.OUTPUT_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`Creando carpeta: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Inicializar aplicación Express
const app = express();

// Configurar middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));
console.log('Archivos estáticos configurados en /public.');

// Configurar almacenamiento de imágenes con multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(`Destino de la imagen: ${process.env.UPLOAD_DIR}`);
    cb(null, process.env.UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    console.log(`Guardando imagen como: ${uniqueName}`);
    cb(null, uniqueName);
  }
});
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    console.log('Archivo recibido:', file);
    if (!file.mimetype.startsWith('image/')) {
      console.error('Error: Solo se permiten imágenes.');
      return cb(new Error('Solo se permiten imágenes.'));
    }
    cb(null, true);
  }
});

// Montar rutas
const imageController = require('./controllers/imageController');
app.post('/process', upload.single('image'), (req, res) => {
  console.log('Solicitud POST /process recibida.');
  console.log('Archivo en req.file:', req.file);
  imageController.processImage(req, res);
});
console.log('Ruta POST /process configurada con multer.');

// Iniciar servidor
const PORT = process.env.PORT || 7200;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});