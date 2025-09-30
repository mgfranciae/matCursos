// Configuracion de rutas

const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// GET /: Home page
router.get('/', roomController.home);
console.log('Route GET / configured.');

// POST /room: crear o unirse
router.post('/room', roomController.createRoom);
console.log('Route POST /room configured.');

// GET /room: pagina de videollamada
router.get('/room', roomController.room);
console.log('Route GET /room configured.');

module.exports = router;