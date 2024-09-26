const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

// Ruta para generar el token del administrador
router.post('/admin/generate-token', async (req, res) => {
    const { adminId } = req.body; // ID del administrador que quiere generar el token

    try {
        // Verifica que el usuario sea un administrador
        const admin = await User.findById(adminId);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ error: 'No autorizado' });
        }

        // Crea el token
        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1d' // O el tiempo que desees
        });

        // Devuelve el token al administrador
        return res.status(200).json({ token });
    } catch (error) {
        console.error('Error al generar el token:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;