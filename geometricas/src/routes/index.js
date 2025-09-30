// Configuración de rutas HTTP
const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

// Ruta POST para procesar imágenes
router.post('/process', imageController.processImage);
console.log('Ruta POST /process configurada.');

module.exports = router;