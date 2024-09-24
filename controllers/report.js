const reportsRouter = require('express').Router();
const Report = require('../models/report');
const { userExtractor } = require('../middleware/auth.js');

// Endpoint para crear un nuevo informe
reportsRouter.post('/', userExtractor, async (request, response) => {
    const { type, victimCount, district, weaponUsed, motorcycleUsed } = request.body;

    const date = new Date().toISOString(); // Cambiar a ISO

    // Validación de campos requeridos
    if (!date || !type || !victimCount || isNaN(victimCount) || !district || weaponUsed === undefined || motorcycleUsed === undefined) {
        return response.status(400).json({ error: 'Todos los campos son requeridos y victimCount debe ser un número' });
    }

    try {
        const user = request.user;

        const newReport = new Report({
            date,
            type,
            victimCount: parseInt(victimCount), // Asegúrate de convertir a número
            district,
            weaponUsed,
            motorcycleUsed,
            user: user._id,
        });

        const savedReport = await newReport.save();
        return response.status(201).json(savedReport);
    } catch (error) {
        console.error('Error al crear el informe:', error.message);
        return response.status(500).json({ error: 'Error al crear el informe. Detalles: ' + error.message });
    }
});

// Endpoint para obtener informes
reportsRouter.get('/', userExtractor, async (request, response) => {
    try {
        const user = request.user;

        let reports;

        if (user.role === 'admin') {
            reports = await Report.find({}).populate('user', { username: 1, role: 1 });
        } else {
            reports = await Report.find({ user: user._id }).populate('user', { username: 1, role: 1 });
        }

        return response.status(200).json(reports.map(report => ({
            id: report.id,
            date: report.date,
            type: report.type,
            victimCount: report.victimCount,
            district: report.district,
            weaponUsed: report.weaponUsed,
            motorcycleUsed: report.motorcycleUsed,
            user: report.user.username
        })));
    } catch (error) {
        console.error('Error al obtener los informes:', error);
        return response.status(500).json({ error: 'Error al obtener los informes' });
    }
});

module.exports = reportsRouter;