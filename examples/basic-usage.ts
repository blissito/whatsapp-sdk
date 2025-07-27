// Ejemplo básico de uso del WhatsApp SDK
import { Effect } from 'effect';
import { makeWhatsAppHttpClient } from '../src/http/WhatsAppHttpClient';

// Configuración
const config = {
  phoneNumberId: '1234567890',
  accessToken: 'your-access-token-here',
  baseUrl: 'https://graph.facebook.com',
  apiVersion: 'v17.0'
};

// Crear cliente
const client = makeWhatsAppHttpClient(config);

// Ejemplo 1: Enviar mensaje de texto
const sendWelcomeMessage = async () => {
  try {
    const result = await Effect.runPromise(
      client.sendTextMessage('5215551234567', '¡Bienvenido a Formmy!')
    );
    console.log('Mensaje enviado:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Ejemplo 2: Subir y enviar imagen
const sendImageMessage = async () => {
  try {
    // Simular buffer de imagen
    const imageBuffer = new TextEncoder().encode('imagen-simulada');
    
    // Subir imagen
    const uploadResult = await Effect.runPromise(
      client.uploadMedia({
        data: imageBuffer,
        type: 'image/jpeg'
      })
    );
    
    console.log('Imagen subida:', uploadResult);
  } catch (error) {
    console.error('Error al subir imagen:', error);
  }
};

// Ejemplo 3: Obtener información de media
const getMediaInfo = async (mediaId: string) => {
  try {
    const info = await Effect.runPromise(
      client.getMediaInfo(mediaId)
    );
    console.log('Info de media:', info);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Ejecutar ejemplos
if (require.main === module) {
  console.log('Ejecutando ejemplos...');
  
  // Descomenta para probar
  // sendWelcomeMessage();
  // sendImageMessage();
  // getMediaInfo('12345');
}
