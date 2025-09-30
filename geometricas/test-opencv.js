const cv = require('opencv4nodejs-prebuilt-install');
console.log('OpenCV cargado:', cv ? 'Sí' : 'No');
console.log('Versión de OpenCV:', cv?.version);