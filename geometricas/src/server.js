const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const multer = require('multer');
const fs = require('fs').promises;
const cors = require('cors'); // Importar cors

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
[process.env.UPLOAD_DIR, process.env.OUTPUT_DIR].forEach(async dir => {
  if (!(await fs.access(dir).then(() => true).catch(() => false))) {
    console.log(`Creando carpeta: ${dir}`);
    await fs.mkdir(dir, { recursive: true });
  }
});

// Inicializar aplicaci�n Express
const app = express();

// Configurar middleware CORS
// Configurar middleware CORS
app.use(cors({
  origin: '*', // Permitir solicitudes desde cualquier lugar, puede poner ip y puerto en especifico como http://localhost:5174.
  methods: ['GET', 'POST'], // M�todos permitidos
  allowedHeaders: ['Content-Type'], // Encabezados permitidos
}));

console.log('Middleware CORS configurado para http://localhost:5174');

// Configurar middleware para servir archivos est�ticos
app.use(express.static(path.join(__dirname, '../public')));
console.log('Archivos est�ticos configurados en /public.');

// Configurar almacenamiento de im�genes con multer
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
      console.error('Error: Solo se permiten im�genes.');
      return cb(new Error('Solo se permiten im�genes.'));
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 } // L�mite de 10MB
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
  console.log(`Servidor ejecut�ndose en http://localhost:${PORT}`);
});