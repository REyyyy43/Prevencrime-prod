const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userExtractor = async (request, response, next) => {
    try {
        const token = request.cookies?.accessToken;
        if (!token) {
            return response.status(401).send({ error: 'No se proporcionó un token de acceso.' });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return response.status(404).send({ error: 'Usuario no encontrado.' });
        }

        // Asignar el usuario al objeto request para que esté disponible en las rutas posteriores
        request.user = user;
        console.log('Usuario:', user);
        
        next();
    } catch (error) {
        console.error('Error al extraer el usuario:', error);
        return response.status(403).send({ error: 'Token inválido o expirado.' });
    }
};

module.exports = { userExtractor };