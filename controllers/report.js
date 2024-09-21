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

// Endpoint para obtener informes, diferenciando entre usuarios y administradores
reportsRouter.get('/', userExtractor, async (request, response) => {
    try {
        const user = request.user; // Obtener el usuario autenticado del middleware userExtractor

        let reports;

        if (user.role === 'admin') {
            // Si el usuario es administrador, obtener todos los informes
            reports = await Report.find({});
        } else {
            // Si el usuario no es administrador, obtener solo sus informes
            reports = await Report.find({ user: user._id });
        }

        return response.status(200).json(reports);
    } catch (error) {
        console.error('Error al obtener los informes:', error);
        return response.status(500).json({ error: 'Error al obtener los informes' });
    }
});

module.exports = reportsRouter;