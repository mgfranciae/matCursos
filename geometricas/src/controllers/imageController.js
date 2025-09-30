const cv = require('opencv4nodejs-prebuilt-install');
const path = require('path');
const fs = require('fs');

// Verificar que OpenCV se carg� correctamente
console.log('M�dulo OpenCV cargado:', cv ? 'S�' : 'No');
if (!cv) {
  console.error('Error: No se pudo cargar el m�dulo OpenCV.');
  process.exit(1);
}

// Controlador para procesar im�genes y detectar formas
exports.processImage = async (req, res) => {
  console.log('Procesando imagen recibida.');

  if (!req.file) {
    console.error('No se recibi� ninguna imagen.');
    return res.status(400).json({ error: 'No se proporcion� ninguna imagen.' });
  }

  const imagePath = req.file.path;
  console.log(`Ruta de imagen: ${imagePath}`);

  try {
    // Verificar que la imagen existe
    if (!fs.existsSync(imagePath)) {
      console.error('Error: La imagen no existe en', imagePath);
      return res.status(400).json({ error: 'La imagen no se encuentra en el servidor.' });
    }

    // Paso 1: Cargar imagen con OpenCV
    console.log('Intentando cargar imagen con cv.imread...');
    const img = cv.imread(imagePath);
    console.log('Imagen cargada con OpenCV.');

    // Paso 2: Convertir a escala de grises
    const gray = img.cvtColor(cv.COLOR_BGR2GRAY);
    console.log('Imagen convertida a escala de grises.');

    // Paso 3: Aplicar umbral para binarizaci�n
    const thresh = gray.threshold(128, 255, cv.THRESH_BINARY_INV);
    console.log('Umbral aplicado para binarizaci�n.');

    // Paso 4: Encontrar contornos
    const contours = thresh.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    console.log(`Se encontraron ${contours.length} contornos.`);

    // Lista para almacenar formas detectadas
    const shapes = [];

    // Procesar cada contorno
    contours.forEach((contour, i) => {
      try {
        const approx = contour.approxPolyDP(0.02 * contour.arcLength(true), true);
        const vertices = approx.length;

        let shapeType = 'Desconocido';
        if (vertices === 3) {
          shapeType = 'Tri�ngulo';
        } else if (vertices === 4) {
          const rect = contour.boundingRect();
          const aspectRatio = rect.width / rect.height;
          if (Math.abs(aspectRatio - 1) < 0.2) {
            shapeType = 'Cuadrado';
          } else if (Math.abs(aspectRatio - 1) < 0.5) {
            shapeType = 'Rombo';
          } else {
            shapeType = 'Rect�ngulo';
          }
        } else if (vertices > 4) {
          shapeType = 'Pol�gono';
        } else {
          // Verificar circularidad
          const area = contour.area;
          const perimeter = contour.arcLength(true);
          const circularity = (4 * Math.PI * area) / (perimeter * perimeter);
          if (circularity > 0.8) {
            shapeType = 'C�rculo';
          }
        }

        shapes.push({
          tipo: shapeType,
          vertices,
          coordenadas: contour.boundingRect(),
          didactico: `Contorno ${i + 1}: Detectado como ${shapeType} con resoluci�n ${vertices} v�rtices.`
        });
        console.log(`Contorno ${i + 1}: ${shapeType} (v�rtices: ${vertices}).`);
      } catch (err) {
        console.error(`Error procesando contorno ${i + 1}:`, err.message || err);
      }
    });

    // Paso 5: Dibujar formas en la imagen para visualizaci�n
    try {
      contours.forEach((contour, i) => {
        console.log(`Dibujando contorno ${i + 1}...`);
        // Usar getPoints() en lugar de points
        const points = contour.getPoints();
        img.drawContours([points], -1, new cv.Vec3(0, 255, 0), 2);
        const rect = contour.boundingRect();
        img.putText(shapes[i]?.tipo || 'Desconocido', new cv.Point(rect.x, rect.y - 10), cv.FONT_HERSHEY_SIMPLEX, 0.5, new cv.Vec3(255, 0, 0));
      });
      console.log('Contornos dibujados en la imagen.');
    } catch (err) {
      console.error('Error dibujando contornos o texto:', err.message || err);
    }

    // Guardar imagen procesada
    const outputPath = path.join(process.env.OUTPUT_DIR, `processed-${req.file.filename}`);
    console.log('Intentando guardar imagen procesada en:', outputPath);
    try {
      cv.imwrite(outputPath, img);
      console.log(`Imagen procesada guardada en: ${outputPath}`);
    } catch (err) {
      console.error('Error guardando imagen procesada:', err.message || err);
      return res.status(500).json({ error: 'Error guardando imagen procesada: ' + (err.message || err) });
    }

    // Enviar respuesta
    res.json({
      shapes,
      processedImage: `/output/processed-${req.file.filename}`,
      didactico: 'Pasos: 1) Conversi�n a gris, 2) Binarizaci�n, 3) Detecci�n de contornos, 4) Clasificaci�n de formas.'
    });

    // Limpiar archivo original
    try {
      console.log('Intentando eliminar imagen original:', imagePath);
      fs.unlinkSync(imagePath);
      console.log(`Imagen original eliminada: ${imagePath}`);
    } catch (err) {
      console.error('Error eliminando imagen original:', err.message || err);
    }
  } catch (err) {
    console.error('Error procesando la imagen:', err.message || err);
    res.status(500).json({ error: 'Error procesando la imagen: ' + (err.message || err) });
  }
};