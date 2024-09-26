const reportsRouter = require('express').Router();
const Report = require('../models/report');
const { userExtractor } = require('../middleware/auth.js');

// Endpoint para crear un nuevo informe
reportsRouter.post('/', userExtractor, async (request, response) => {
    const { date, type, victimCount, district, weaponUsed, motorcycleUsed } = request.body;

    if (!date || !type || !victimCount || !district || weaponUsed === undefined || motorcycleUsed === undefined) {
        return response.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    try {
        const user = request.user;

        const newReport = new Report({
            date,
            type,
            victimCount,
            district,
            weaponUsed,
            motorcycleUsed,
            user: user._id,
        });
 
        const savedReport = await newReport.save();
        return response.status(201).json(savedReport);
    } catch (error) {
        console.error('Error al crear el informe:', error);
        return response.status(500).json({ error: 'Error al crear el informe' });
    }
 
});

// Endpoint para obtener todos los informes
reportsRouter.get('/admin', async (request, response) => { // Ajusta la ruta a '/'
    try {
        const reports = await Report.find(); // Obtener todos los informes desde la base de datos
        return response.status(200).json(reports); // Responder con los informes en formato JSON
    } catch (error) {
        console.error('Error al obtener los informess:', error);
        response.status(500).json({ error: 'Error al obtener los informes' });
    }
});

// Endpoint para obtener los informes del usuario autenticado
reportsRouter.get('/user', userExtractor, async (request, response) => {
    try {
        const user = request.user;
        const userReports = await Report.find({ user: user._id }); // Filtra por el ID del usuario autenticado
        return response.status(200).json(userReports);
    } catch (error) {
        console.error('Error al obtener los informes del usuario:', error);
        return response.status(500).json({ error: 'Error al obtener los informes del usuario' });
    }
});

module.exports = reportsRouter;