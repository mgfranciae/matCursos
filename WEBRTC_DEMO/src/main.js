// Importar modulos
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const dotenv = require('dotenv');

// cargar variables de entorno desde .env
dotenv.config();
console.log('Environment variables loaded.');

// Inicializar el servidor
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' } // CORS para permitir conexiones locales
});

// Set EJS 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
console.log('EJS configurado como motor de vistas');

// --------------------
app.use(express.static(path.join(__dirname, 'public')));
console.log('Archivos estaticos disponibles desde "public".');

// 
app.use(express.urlencoded({ extended: true }));

// añadiendo las rutas
app.use('/', require('./routes/index'));
console.log('Rutas HTTP creadas.');

// Socket.io señalizacion para WebRTC
io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);
  
  // unirse a la sala
  socket.on('join-room', (roomId, userId) => {
    console.log(`Cliente ${socket.id} se unio a la sala ${roomId} como ${userId}`);
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId); // notificar a los demas
  });
  
  // 
  socket.on('offer', (data) => {
    console.log(`Conexion recibida en ${data.roomId} desde ${data.from}`);
    socket.to(data.roomId).emit('offer', data);
  });
  
  // manejar respuestas
  socket.on('answer', (data) => {
    console.log(`Respuesta recibida de ${data.roomId} desde ${data.from}`);
    socket.to(data.roomId).emit('answer', data);
  });
  
  // 
  socket.on('ice-candidate', (data) => {
    console.log(`Candidato ICE  ${data.roomId} desde ${data.from}`);
    socket.to(data.roomId).emit('ice-candidate', data);
  });
  
  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

console.log('Servidor de señalización Socket.io conectado.');

// Iniciar server
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT} (Use red local para probar)`);
});