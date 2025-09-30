// Configuraci�n de rutas HTTP
const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

// Ruta POST para procesar im�genes
router.post('/process', imageController.processImage);
console.log('Ruta POST /process configurada.');

module.exports = router;