const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { PAGE_URL } = require('../config');

// Ruta para obtener todos los usuarios
usersRouter.get('/', async (request, response) => {
  try {
    const users = await User.find();
    return response.status(200).json(users);
  } catch (error) {
    console.error('Error obteniendo datos de los usuarios:', error);
    return response.status(500).json({ error: 'Error del servidor' });
  }
});

// Crear un nuevo usuario y enviar el correo de verificación
usersRouter.post('/', async (request, response) => {
  const { name, email, password, phone } = request.body;

  if (!name || !email || !password || !phone) {
    return response.status(400).json({ error: 'Todos los espacios son requeridos' });
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    return response.status(400).json({ error: 'El email ya se encuentra en uso' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    name,
    email,
    passwordHash,
    phone,
    role: 'cliente',
    verified: false, // Añadir el campo de verificación
  });

  const savedUser = await newUser.save();
  const token = jwt.sign({ id: savedUser.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1d',
  });

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER, // sender address
    to: savedUser.email, // list of receivers
    subject: 'Gracias por registrarte en Prevencrime, por favor verifica tu correo', // Subject line
    html: `<a href="${PAGE_URL}/verify/${savedUser.id}/${token}">Verificar correo</a>`, // html body
  });

  return response.status(201).json('Usuario creado. Por favor verifica tu correo');
});

// Verificar el token y actualizar el estado de verificación del usuario
usersRouter.patch('/:id/:token', async (request, response) => {
  const token = request.params.token;
  const id = request.params.id;

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decodedToken.id !== id) {
      return response.status(400).json({ error: 'Token inválido' });
    }

    await User.findByIdAndUpdate(id, { verified: true });
    return response.sendStatus(200);
  } catch (error) {
    console.error('Error verificando el token:', error);

    // Enviar un nuevo correo de verificación si el token ha expirado
    const user = await User.findById(id);
    if (!user) {
      return response.status(404).json({ error: 'Usuario no encontrado' });
    }

    const newToken = jwt.sign({ id: id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1d',
    });

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER, // sender address
      to: user.email, // list of receivers
      subject: 'Gracias por registrarte en Prevencrime, por favor verifica tu correo', // Subject line
      html: `<a href="${PAGE_URL}/verify/${id}/${token}">Verificar correo</a>`, // html body
    });

    return response.status(400).json({ error: 'El link ya expiró. Se ha enviado un nuevo link de verificación a su correo' });
  }
});

module.exports = usersRouter;