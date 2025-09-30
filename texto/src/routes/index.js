// Define routes and link them to controllers

const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

// Root route: Home page
router.get('/', mainController.home);
console.log('Ruta principal GET / configurada.');

// Plain textarea route
router.get('/plain', mainController.plain);
console.log('Ruta GET /plain configurada.');

// Quill editor route
router.get('/quill', mainController.quill);
console.log('Ruta GET /quill configurada.');

module.exports = router;