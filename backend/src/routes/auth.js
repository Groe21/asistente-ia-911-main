const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register — Crear nuevo usuario con cédula
router.post('/register', async (req, res) => {
  try {
    const { cedula, nombre, apellido, password } = req.body;

    if (!cedula || !nombre || !apellido || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const existing = await prisma.user.findUnique({ where: { cedula } });
    if (existing) {
      return res.status(400).json({ error: 'Ya existe un usuario con esta cédula' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { cedula, nombre, apellido, password: hashedPassword },
      select: { id: true, cedula: true, nombre: true, apellido: true, role: true }
    });

    const token = jwt.sign(
      { id: user.id, cedula: user.cedula, role: user.role },
      process.env.JWT_SECRET || 'demo-secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// POST /api/auth/login — Iniciar sesión con cédula + contraseña
router.post('/login', async (req, res) => {
  try {
    const { cedula, password } = req.body;

    if (!cedula || !password) {
      return res.status(400).json({ error: 'Cédula y contraseña son obligatorios' });
    }

    const user = await prisma.user.findUnique({ where: { cedula } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: user.id, cedula: user.cedula, role: user.role },
      process.env.JWT_SECRET || 'demo-secret',
      { expiresIn: '24h' }
    );

    res.json({
      user: {
        id: user.id,
        cedula: user.cedula,
        nombre: user.nombre,
        apellido: user.apellido,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// GET /api/auth/me — Obtener usuario actual
router.get('/me', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, cedula: true, nombre: true, apellido: true, role: true, createdAt: true }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

module.exports = router;
