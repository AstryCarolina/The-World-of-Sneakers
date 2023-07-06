const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");
const fs = require("fs");
const bodyParser = require("body-parser"); // Agrega esta línea

const idLength = 6;

/**
 * @swagger
 * components:
 *  schemas:
 *      Id:
 *          type: String
 *          description: ID autogenerado (NanoId)
 *          example: XezX1p
 *      Articulos:
 *          type: object
 *          required:
 *              - id
 *              - email
 *              - password
 *          properties:
 *              id:
 *                  type: string
 *                  description: ID autogenerado (NanoId)
 *              email:
 *                  type: string
 *                  description: Nome
 *              password:
 *                  type: string
 *                  description: Marca
 *          example:
 *              id: XezX1p
 *              email: prueba@gmail.com
 *              password: 123456
 */

/**
 * @swagger
 * tags:
 *  name: Articulos
 *  description: API Articulos
 */




/**
 * @swagger
 * /articulos:
 *  get:
 *      sumary: Devuelve la lista de articulos
 *      tags:   [Articulos]
 *      responses:
 *          200:
 *              description: Lista de emails
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Articulos'
 */
router.get("/",(req,res)=>{
    const articulos = req.app.db.get("articulos");
    res.send(articulos);
});


/**
 * @swagger
 * /articulos/{id}:
 *  get:
 *      sumary: Devuelve lista de emails y constraseñas
 *      tags:   [Articulos]
 *      parameters:
 *          name: id
 *          email: email
 *          password: password
 *          in: path
 *          schema:
 *              type: string
 *          required: true
 *          description: ID autogenerado (NanoId)
 *      responses:
 *          200:
 *              description: Exito al obtener un Articulos
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Articulos'
 *          404:
 *              description: No se encontro el Articulo
 */
router.get("/:id",(req,res)=>{
    const articulo = req.app.db.get("articulos").find({id: req.params.id}).value();

    if(!articulo){
        res.sendStatus(404);
    }else{
        res.send(articulo);
    }
});

/**
 * @swagger
 * /articulos:
 *  post:
 *      sumary: Registra un email y contraseña
 *      tags:   [Articulos]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                          $ref: '#/components/schemas/Articulos'
 *          200:
 *              description: Registra una lista de emails y contraseñas
 *              content:
 *                  application/json:
 *                      schema:
 *                              $ref: '#/components/schemas/Articulos'
 *          500:
 *              description: Error al registrar una lista de emails y contraseñas
 *              content:
 *                  application/json:
 *                      schema:
 *                              $ref: '#/components/schemas/Articulos'
 */

router.use(bodyParser.urlencoded({ extended: false })); 
router.post("/", (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new Error("Faltan campos obligatorios");
      }
      const nuevoArticulo = {
        id: nanoid(idLength),
        email,
        password,
      };
  
      fs.readFile("db.json", "utf8", (err, data) => {
        if (err) {
          res.status(500).json({ error: "Error al leer la base de datos" });
        } else {
          const db = JSON.parse(data);
          db.articulos.push(nuevoArticulo);
          fs.writeFile("db.json", JSON.stringify(db), (err) => {
            if (err) {
              res.status(500).json({ error: "Error al escribir en la base de datos" });
            } else {
              res.status(200).json({ message: "Usuario registrado correctamente"});
            }
          });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
  

/**
 * @swagger
 * /articulos/{id}:
 *  put:
 *      sumary: Actualizar articulos
 *      tags:   [Articulos]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                          $ref: '#/components/schemas/Articulos'
 *      responses:
 *          200:
 *              description: Actualiza un artículo de la lista
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Articulos'
 *          500:
 *              description: Error al actualizar un artículo
 *              content:
 *                  application/json:
 *                      schema:
 *                              $ref: '#/components/schemas/Articulos'
 */

router.put("/:id",(req,res)=>{
    try{
        req.app.db.get("articulos")
                .find({id: req.params.id})
                .assing(req.body)
                .write();

        res.send(req.app.db.get("articulos").find({id: req.params.id}));

    }catch(error){
        return res.status(500).send(error);
    }
});

/**
 * @swagger
 * /articulos/{id}:
 *  delete:
 *      sumary: Elimina un articulo
 *      tags:   [Articulos]
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                          $ref: '#/components/schemas/Articulos'
 *      responses:
 *          200:
 *              description: El producto ha sido eliminado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Articulos'
 */

router.delete("/:id",(req,res)=>{
    req.app.db.get("articulos").remove({id: req.params.id}).write();

    res.sendStatus(200);
});

module.exports= router;
