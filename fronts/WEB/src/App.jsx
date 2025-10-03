// Componente que contiene toda la lógica y UI del formulario
import ImageUploader from './components/ImageUploader';
import './App.css'; // Estilos globales

/**
 * Componente raíz. Simplemente envuelve el componente principal.
 */
function App() {
  // No hay lógica de estado aquí; se delega al ImageUploader
  return (
    <div className="main-wrapper">
      <ImageUploader />
    </div>
  );
}

export default App;