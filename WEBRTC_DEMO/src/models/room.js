class Room {
  constructor(id) {
    this.id = id;
    this.users = new Set(); // 
  }
  
  // verifica si la sala existe
  exists() {
    // en una app real, esta info esta en una base de datos.
    return true;
  }
  
  // Crear sala
  create() {
    console.log(`Model: Room ${this.id} created.`);
    this.users.clear();
  }
  
  // Añadir usuario
  addUser(userId) {
    this.users.add(userId);
    console.log(`Model: User ${userId} added to room ${this.id}.`);
  }
  
  // Remover usuario
  removeUser(userId) {
    this.users.delete(userId);
    console.log(`Model: User ${userId} removed from room ${this.id}.`);
  }
}

// Registro de usuarios en memoria
const rooms = new Map();

module.exports = Room; // 