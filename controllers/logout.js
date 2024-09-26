const logoutRouter = require('express').Router();

// Ruta para cerrar sesión de usuarios
logoutRouter.get('/user', async (request, response) => {
    const { cookies } = request;

    // Verificar si existe el accessToken y eliminarlo
    if (cookies?.accessToken) {
        // Eliminar solo el token de usuario
        response.clearCookie('accessToken', {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true
        });
    }

    return response.sendStatus(204); // Retornar 204 si todo sale bien
});

// Ruta para cerrar sesión de administradores
logoutRouter.get('/admin', async (request, response) => {
    const { cookies } = request;

    // Verificar si existe el adminToken y eliminarlo
    if (cookies?.adminToken) {
        // Eliminar solo el token de admin
        response.clearCookie('adminToken', {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true
        });
    }

    return response.sendStatus(204); // Retornar 204 si todo sale bien
});

module.exports = logoutRouter;