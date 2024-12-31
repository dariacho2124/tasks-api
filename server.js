const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const taskRoutes = require("./routes/Tasks");
const userRoutes = require("./routes/Users");
const swaggerUI = require("swagger-ui-express");
const swaggerSpecs = require("./swagger");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));
// Rutas
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// Servidor
const PORT = 3300;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
