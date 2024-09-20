const app = require('./app');
const http = require('http');

const PORT = process.env.PORT || 3005; // Usa el puerto asignado por Render o 3005 como fallback

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`El servidor está corriendo en el puerto ${PORT}`);
});
