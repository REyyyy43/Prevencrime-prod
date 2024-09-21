const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userExtractor = async (request, response, next) => {
    try {
        const token = request.cookies?.accessToken; // Se obtiene el token de las cookies
        if (!token) {
            return response.status(401).send({ error: 'No se proporcionó un token de acceso.' });
        }

        // Verificar el token y decodificarlo
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Buscar el usuario en la base de datos
        const user = await User.findById(decoded.id);
        if (!user) {
            return response.status(404).send({ error: 'Usuario no encontrado.' });
        }

        // Asignar el usuario al request para que esté disponible en las rutas siguientes
        request.user = user;
        
        console.log('Usuario autenticado:', user);

        // Pasar al siguiente middleware o ruta
        next();
    } catch (error) {
        console.error('Error al extraer el usuario:', error);
        return response.status(403).send({ error: 'Token inválido o expirado.' });
    }
};

module.exports = { userExtractor };