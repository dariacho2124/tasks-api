const swaggerJSDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Tareas",
      version: "1.0.0",
      description: "Documentación de la API de tareas",
    },
    servers: [
      {
        url: "http://localhost:3300/api",
      },
    ],
  },
  apis: ["./routes/Tasks.js", "./routes/Users.js"], // Ruta donde tienes definidas las rutas de tu API
};

const swaggerSpecs = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpecs;
