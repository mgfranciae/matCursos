// src/components/ImageUploader.jsx

import React, { useState, useRef } from 'react';

// Se incorporan las nuevas variables de entorno
const API_SERVER_IP = import.meta.env.VITE_API_SERVER_IP || '192.168.10.148';
const API_SERVER_PORT = import.meta.env.VITE_API_SERVER_PORT || '7200';
// Construcción de la URL con la nueva variable de puerto
const API_BASE_URL = `http://${API_SERVER_IP}:${API_SERVER_PORT}/process`;

/**
 * Componente funcional principal para la subida de imágenes.
 */
function ImageUploader() {
    const fileInputRef = useRef(null);
    
    // Simplificamos: isFileSelected ahora se controla directamente con el onChange
    const [isFileSelected, setIsFileSelected] = useState(false); 
    
    const [processedImageUri, setProcessedImageUri] = useState(null);
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * CORRECCIÓN CLAVE: Función que se llama cuando el valor del input cambia.
     * Esto actualiza el estado isFileSelected inmediatamente.
     */
    const handleFileChange = (e) => {
        // e.target.files contiene la lista de archivos seleccionados.
        // Si la lista tiene 1 o más elementos, isFileSelected será true.
        setIsFileSelected(e.target.files.length > 0);
        setError(null); // Limpiamos errores si se selecciona un nuevo archivo
    };

    /**
     * Maneja el envío del formulario.
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        
        setError(null);
        setResults(null);
        setProcessedImageUri(null);

        const file = fileInputRef.current?.files?.[0];
        if (!file) {
            setError("Debe seleccionar un archivo de imagen para continuar.");
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            setResults(data);
            // Uso de API_SERVER_IP y API_SERVER_PORT para la URL de la imagen procesada
            const fullProcessedUri = `http://${API_SERVER_IP}:${API_SERVER_PORT}${data.processedImage}`;
            setProcessedImageUri(fullProcessedUri);

        } catch (err) {
            console.error('Error durante el envío:', err);
            setError(`Fallo de conexión o del API. Revise la IP, puerto (${API_SERVER_PORT}) y el servidor: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const renderShapes = (shapes) => (
        <div className="data-output">
            <h3>Análisis Detallado:</h3>
            <p className="didactico-general">
                **Pasos:** {results.didactico}
            </p>
            <ul className="shapes-list">
                {shapes.map((shape, index) => (
                    <li key={index} className="shape-item">
                        <p>
                            **Tipo:** {shape.tipo} ({shape.vertices} vértices)
                        </p>
                        <p className="didactico-detail">
                            {shape.didactico}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className="container">
            <h1>Laboratorio de Detección de Formas (Web)</h1>
            <p className="endpoint-info">Conectado a: {API_BASE_URL}</p>
            
            <form onSubmit={handleSubmit} className="upload-form">
                <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} // <--- NUEVA ASIGNACIÓN DE HANDLER
                    disabled={isLoading}
                />
                
                <button 
                    type="submit" 
                    // El botón está deshabilitado si está cargando O si no hay archivo seleccionado
                    disabled={isLoading || !isFileSelected}
                >
                    {isLoading ? "Enviando..." : "Enviar Imagen para Procesamiento"}
                </button>
            </form>
            
            {/* Mensajes de Estado */}
            {error && <p className="message error">{error}</p>}
            
            {/* Renderizado Condicional de Resultados */}
            {results && (
                <div className="results-panel">
                    <h2>Resultados</h2>
                    <div className="image-output">
                        <h3>Imagen Procesada</h3>
                        <img 
                            src={processedImageUri} 
                            alt="Imagen procesada por el servidor" 
                            className="processed-image" 
                        />
                    </div>
                    {renderShapes(results.shapes)}
                </div>
            )}
        </div>
    );
}

export default ImageUploader;