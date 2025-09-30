// Import required modules
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();
console.log('.env cargado con éxito.');

// Initialize Express app
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
console.log('Motor de plantillas establecido a EJS.');

// Serve static files from the public folder (for styles and scripts)
app.use(express.static(path.join(__dirname, 'public')));
console.log('Se configuró /public. para archivos estáticos');

// Use routes defined in routes/index.js
app.use('/', require('./routes/index'));
console.log('Rutas establecidas.');

// Get port from .env or default to 3000
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}.`);
});