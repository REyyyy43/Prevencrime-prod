const loginRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

loginRouter.post('/', async (request , response) => {
    const { email, password } = request.body;
    const userExist = await User.findOne({ email });

    if (!userExist) {
        return response.status(400).json({error: 'el email o la contraseña es invalida' });
    }
    if (!userExist.verified) {
        return response.status(400).json({error: 'el email no ha sido verificado' });
    }
    
    const isCorrect = await bcrypt.compare(password, userExist.passwordHash);
    if (!isCorrect) {
        return response.status(400).json({error: 'el email o la contraseña es invalida' });
    }
    
    const userForToken = {
       id: userExist.id
    }
    
        const  accessToken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET, { 
        expiresIn: '1d'
        });
       
        response.cookie('accessToken', accessToken, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
        });

        return response.status(200).json(userExist);

});
module.exports = loginRouter;