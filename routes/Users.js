const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const router = express.Router();

/**
 * Mock de usuario (username: admin, password: admin)
 */
const mockUser = {
  username: "admin",
  password: "admin-test",
};

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: El nombre de usuario
 *         password:
 *           type: string
 *           description: La contraseña del usuario
 *       example:
 *         username: admin
 *         password: admin-test
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Inicia sesión y devuelve un token JWT
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT
 *       401:
 *         description: Credenciales incorrectas
 */
router.post(
  "/login",
  [
    body("username")
      .notEmpty()
      .withMessage("El nombre de usuario es obligatorio"),
    body("password").notEmpty().withMessage("La contraseña es obligatoria"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // Verificar las credenciales
    if (username === mockUser.username && password === mockUser.password) {
      // Generar el token JWT
      const token = jwt.sign(
        { username },
        process.env.JWT_SECRET || "secretkey",
        {
          expiresIn: "1h",
        },
      );
      return res.status(200).json({ token });
    }

    return res.status(401).json({ message: "Credenciales incorrectas" });
  },
);

module.exports = router;
