const Room = require('../models/room'); // 

// Pagina de inicio
exports.home = (req, res) => {
  console.log('Página de inicio(/).');
  res.render('index');
};

// crear o unirse
exports.createRoom = (req, res) => {
  const roomId = req.body.roomId || 'sala_de_Prueba'; // From form input
  console.log(`Crear/unirse a la sala: ${roomId}`);
  
  
  const room = new Room(roomId);
  if (!room.exists()) {
    room.create();
    console.log(`Sala ${roomId} creada.`);
  } else {
    console.log(`Ingreso a ${roomId} `);
  }
  

  res.redirect(`/room?room=${roomId}`);
};

// Interfaz de videollamada para la Sala Creada
exports.room = (req, res) => {
  const roomId = req.query.room || 'sala_de_Prueba';
  console.log(`Renderizando página para la sala: ${roomId}`);
  
  // ID de SALA:
  res.render('room', { roomId });
};