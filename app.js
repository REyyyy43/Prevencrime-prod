require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const logoutRouter = require('./controllers/logout');
const reportsRouter = require('./controllers/report');
const { userExtractor } = require('./middleware/auth');
const { MONGO_URI } = require('./config');

(async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.log(error);
    }
})();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('tiny'));

// Rutas frontend
app.use('/', express.static(path.resolve('views', 'Home')));
app.use('/Herramientas', express.static(path.resolve('views', 'Herramientas')));
app.use('/HerramientasInv', express.static(path.resolve('views', 'HerramientasInv')));
app.use('/Registro', express.static(path.resolve('views', 'Registro')));
app.use('/styles', express.static(path.resolve('views', 'styles')));
app.use('/RegistroDE', express.static(path.resolve('views', 'RegistroDE')));
app.use('/RegisterDE', express.static(path.resolve('views', 'RegisterDE')));
app.use('/Recomendaciones', express.static(path.resolve('views', 'Recomendaciones')));
app.use('/login', express.static(path.resolve('views', 'login')));
app.use('/Admin', express.static(path.resolve('views', 'Admin')));
app.use('/UsersRegister', express.static(path.resolve('views', 'UsersRegister')));
app.use('/SobreNosotros', express.static(path.resolve('views', 'SobreNosotros')));
app.use('/compartir', express.static(path.resolve('views', 'compartir')));
app.use('/Components', express.static(path.resolve('views', 'Components')));
app.use('/images', express.static(path.resolve('img')));
app.use('/verify/:id/:token', express.static(path.resolve('views', 'verify')));

// Rutas backend
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/reports', userExtractor, reportsRouter);

module.exports = app;