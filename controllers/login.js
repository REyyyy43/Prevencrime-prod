const loginRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

loginRouter.post('/', async (request, response) => {
    const { email, password } = request.body;
    const userExist = await User.findOne({ email });

    if (!userExist) {
        return response.status(400).json({ error: 'El email o la contraseña es inválida' });
    }
    if (!userExist.verified) {
        return response.status(400).json({ error: 'El email no ha sido verificado' });
    }

    const isCorrect = await bcrypt.compare(password, userExist.passwordHash);
    if (!isCorrect) {
        return response.status(400).json({ error: 'El email o la contraseña es inválida' });
    }

    // Limpiar las cookies antes de establecer una nueva sesión
    response.clearCookie('adminToken');
    response.clearCookie('accessToken');

    // Crear el token según el rol
    const userForToken = { id: userExist.id, role: userExist.role };
    let token;

    if (userExist.role === 'admin') {
        token = jwt.sign(userForToken, process.env.ADMIN_TOKEN_SECRET, { expiresIn: '1d' });
        response.cookie('adminToken', token, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true
        });
    } else {
        token = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
        response.cookie('accessToken', token, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true
        });
    }

    return response.status(200).json({
        id: userExist.id,
        name: userExist.name,
        email: userExist.email,
        role: userExist.role
    });
});

module.exports = loginRouter;