const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const low = require("lowdb");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const artRouter = require("./routes/articulos");
const bodyParser = require("body-parser"); // Agrega esta línea

const PORT = process.env.PORT || 10003;

// Configuración de la base de datos
const FileDB = require("lowdb/adapters/FileSync");
const adapter = new FileDB("db.json");
const db = low(adapter);

db.defaults({ articulos: [] }).write();

// Configuración de Swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "APIs - usuarios",
      version: "1.0.0",
      description: "Demo libreria de APIs de usuarios",
    },
    servers: [
      {
        url: "http://localhost:" + PORT,
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);
app.db = db;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false })); // Agrega esta línea
app.use("/articulos", artRouter);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));

// Configuración para servir archivos estáticos
app.use(express.static("view"));

app.get("/index", function (req, res) {
  res.sendFile("index.html");
});

app.listen(PORT, () => {
  console.log(`El servidor está corriendo en el puerto ${PORT}`);
});
