const cv = require('opencv4nodejs-prebuilt-install');
console.log('OpenCV cargado:', cv ? 'S�' : 'No');
console.log('Versi�n de OpenCV:', cv?.version);