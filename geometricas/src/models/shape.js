// Modelo simple para manejar datos de formas (extensible para DB si necesario)
class Shape {
  constructor(tipo, vertices, coordenadas) {
    this.tipo = tipo;
    this.vertices = vertices;
    this.coordenadas = coordenadas;
  }

  // Método para formatear respuesta didáctica
  toJSON() {
    return {
      tipo: this.tipo,
      vertices: this.vertices,
      coordenadas: this.coordenadas,
      didactico: `Forma detectada: ${this.tipo} con ${this.vertices} vértices.`
    };
  }
}

module.exports = Shape;