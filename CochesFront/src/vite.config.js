// vite.config.js
export default {
  server: {
    host: '0.0.0.0',  // Permite conexiones desde cualquier IP
    port: 4200,       // El puerto en el que el servidor Angular estará escuchando
    allowedHosts: [
      'bodycraft.josbotdev.es', // Permite solicitudes desde este dominio
      '0.0.0.0', // Asegúrate de permitir conexiones desde 0.0.0.0 también
      'localhost',
      '127.0.0.1'
    ],
  },
};
