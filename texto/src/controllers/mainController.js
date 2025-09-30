// Controller para manejar las rutas

// Home page handler
exports.home = (req, res) => {
  console.log('Renderizando página de inicio (/).');
  res.render('index');
};

// Plain textarea page handler
// Demonstrates passing data via query parameters
exports.plain = (req, res) => {
  const phrase = req.query.phrase || ''; // Retrieve phrase from query or default to empty
  console.log(`Renderizando en pagina html simple la frase "${phrase}".`);
  res.render('plain', { phrase }); // Pass phrase to EJS template
};

// Quill editor page handler
// Demonstrates passing data via query parameters
exports.quill = (req, res) => {
  const phrase = req.query.phrase || ''; // Retrieve phrase from query or default to empty
  console.log(`Renderizando la página con quill la frase  "${phrase}".`);
  res.render('quill', { phrase }); // Pass phrase to EJS template
};