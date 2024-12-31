const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const taskRoutes = require("./routes/Tasks");
const userRoutes = require("./routes/Users");
const swaggerUI = require("swagger-ui-express");
const swaggerSpecs = require("./swagger");
const winston = require("winston");

// Configuro Winston para evitar los console
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Log a la consola
    new winston.transports.File({ filename: "app.log" }),
  ],
});

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    logger.info("Conexión exitosa a MongoDB");
  })
  .catch((err) => {
    logger.error(`Error al conectar a MongoDB: ${err.message}`);
    process.exit(1);
  });

// Rutas
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// Servidor
const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
  logger.info(`Servidor corriendo en el puerto ${PORT}`);
});
