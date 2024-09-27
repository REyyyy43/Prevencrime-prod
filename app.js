require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const usersRouter = require('./controllers/users');
const adminRouter = require('./controllers/admin');
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
app.use('/', express.static(path.resolve('views', 'HerramientasInv')));
app.use('/Herramientas', express.static(path.resolve('views', 'Herramientas')));
app.use('/HerramientasAD', express.static(path.resolve('views', 'HerramientasAD')));
app.use('/Registro', express.static(path.resolve('views', 'Registro')));
app.use('/styles', express.static(path.resolve('views', 'styles')));
app.use('/RegistroDE', express.static(path.resolve('views', 'RegistroDE')));
app.use('/DenunciaAD', express.static(path.resolve('views', 'DenunciaAD')));
app.use('/RegisterDE', express.static(path.resolve('views', 'RegisterDE')));
app.use('/RegisterDEA', express.static(path.resolve('views', 'RegisterDEA')));
app.use('/Recomendaciones', express.static(path.resolve('views', 'Recomendaciones')));
app.use('/RecomendacionesAD', express.static(path.resolve('views', 'RecomendacionesAD')));
app.use('/RecomendacionesInv', express.static(path.resolve('views', 'RecomendacionesInv')));
app.use('/login', express.static(path.resolve('views', 'login')));
app.use('/Admin', express.static(path.resolve('views', 'Admin')));
app.use('/UsersRegister', express.static(path.resolve('views', 'UsersRegister')));
app.use('/SobreNosotros', express.static(path.resolve('views', 'SobreNosotros')));
app.use('/SobreNosotrosAD', express.static(path.resolve('views', 'SobreNosotrosAD')));
app.use('/SobreNosotrosInv', express.static(path.resolve('views', 'SobreNosotrosInv')));
app.use('/Components', express.static(path.resolve('views', 'Components')));
app.use('/images', express.static(path.resolve('img')));
app.use('/verify/:id/:token', express.static(path.resolve('views', 'verify')));

// Rutas backend
app.use('/api/users', usersRouter);
app.use('/api/admin/', adminRouter)
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/reports', userExtractor, reportsRouter);

module.exports = app;