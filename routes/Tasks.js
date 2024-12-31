const express = require("express");
const Task = require("../models/Task");
const { validationResult, body } = require("express-validator");
const router = express.Router();
const verifyToken = require("../middleware/auth");

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - completed
 *       properties:
 *         id:
 *           type: string
 *           description: ID de la tarea
 *         title:
 *           type: string
 *           description: El título de la tarea
 *         description:
 *           type: string
 *           description: Una descripción opcional de la tarea
 *         completed:
 *           type: boolean
 *           description: Indica si la tarea está completada
 *       example:
 *         title: Mi tarea
 *         description: Descripción de la tarea
 *         completed: false
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Crea una nueva tarea
 *     security:
 *       - bearerAuth: []
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Tarea creada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Error de validación
 */
router.post(
  "/",
  verifyToken,
  [
    body("title")
      .notEmpty()
      .withMessage("El título es obligatorio")
      .isLength({ min: 10 })
      .withMessage("El título debe tener al menos 5 caracteres"),
    body("description")
      .optional()
      .isLength({ min: 10 })
      .withMessage("La descripción debe tener al menos 10 caracteres"),
    body("completed")
      .optional()
      .isBoolean()
      .withMessage("El campo completed debe ser un valor booleano"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, completed } = req.body;
    const status = completed ? "completed" : "pending";
    try {
      const newTask = new Task({ title, description, completed, status });
      const savedTask = await newTask.save();
      res.status(201).json(savedTask);
    } catch (error) {
      res.status(500).json({ message: "Error al crear la tarea", error });
    }
  },
);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Obtiene todas las tareas
 *     security:
 *       - bearerAuth: []
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [completed, pending]
 *         description: Filtra las tareas por su estado
 *     responses:
 *       200:
 *         description: Lista de tareas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get("/", verifyToken, async (req, res) => {
  const { status } = req.query;

  try {
    let tasks;

    if (status === "completed" || status === "pending") {
      const completed = status === "completed";
      tasks = await Task.find({ completed }).select("-__v");
    } else {
      tasks = await Task.find().select("-__v");
    }

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Obtiene una tarea por su ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Información de la tarea
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tarea no encontrada
 */
router.get("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id).select("-__v");
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Actualiza una tarea por su ID
 *     security:
 *       - bearerAuth: [] 

 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Tarea actualizada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tarea no encontrada
 */
router.put(
  "/:id",
  verifyToken,
  [
    body("title")
      .optional()
      .isLength({ min: 5 })
      .withMessage("El título debe tener al menos 5 caracteres"),
    body("description")
      .optional()
      .isLength({ min: 10 })
      .withMessage("La descripción debe tener al menos 10 caracteres"),
    body("completed")
      .optional()
      .isBoolean()
      .withMessage("El campo completed debe ser un valor booleano"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const status = req.body.completed ? "completed" : "pending";
    const { title, description, completed } = req.body;
    try {
      const updatedTask = await Task.findByIdAndUpdate(
        id,
        { title, description, completed, status },
        { new: true },
      ).select("-__v");

      if (!updatedTask) {
        return res.status(404).json({ message: "Tarea no encontrada" });
      }
      res.status(200).json(updatedTask);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Elimina una tarea por su ID
 *     ecurity:
 *       - bearerAuth: []
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Tarea eliminada con éxito
 *       404:
 *         description: Tarea no encontrada
 */
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTask = await Task.findByIdAndDelete(id).select("-__v");
    if (!deletedTask) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    res.status(200).json({ message: "Tarea eliminada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
