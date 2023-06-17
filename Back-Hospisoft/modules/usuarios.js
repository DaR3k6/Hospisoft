//Modulos requeridos para el proyecto
const express = require("express");
const cors = require("cors"); //Para evitar restricciones entre llamadas de sitios
const usuario = express.Router(); //Trae el metodo router de express para hacer los endpoints
const conex = require("./bdatos.js");
const bycript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util"); //La trae por defecto NODE JS me permite usar async/await opcion a fetch

//Construimos la capa intermedia de la aplicacion MIDDLEWARE
usuario.use(express.json()); //Serializa la data en JSON
usuario.use(cors()); //Permite el acceso de otras direciones IP distintas a mi servicio
usuario.options("*", cors()); //Configura las IP admitidas por cors, * significa que las acepta todas

//Codificamos los verbos HTTP (CRUD tipico)
const campoUsuario = ["NOMBRE", "APELLIDO", "EMAIL", "PASSWORD"];

//VERBO TRAER TODO LOS CAMPOS
usuario.get("/usuarios", async (req, res) => {
  try {
    conex.query("SELECT * FROM usuario; ", (error, respuesta) => {
      console.log(respuesta);
      res.send(respuesta);
    });
  } catch (error) {
    //throw error;
    console.log(error);
  }
});

//Verbo POST INSERTAR USUARIO
usuario.post("/usuarios", async (req, res) => {
  try {
    let data = {};
    campoUsuario.forEach(campo => {
      if (campo === "PASSWORD") {
        data[campo] = bycript.hashSync(req.body[campo]);
      } else {
        data[campo] = req.body[campo];
      }
    });
    conex.query("INSERT INTO usuario SET ?", data, (error, respuesta) => {
      console.log(`Registro correcta ${respuesta}`);
      res.status(201).send(true);
    });
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

//Login de Usuario
usuario.post("/login", async (req, res) => {
  try {
    const email = req.body["EMAIL"];
    const password = req.body["PASSWORD"];
    if (!email || !password) {
      console.log("Debe enviar los datos completos");
    } else {
      conex.query(
        "SELECT * FROM usuario WHERE email = ? ",
        [email],
        async (error, respuesta) => {
          if (
            respuesta.length === 0 ||
            !(await bycript.compare(password, respuesta[0].PASSWORD))
          ) {
            console.log(
              "El usuario y/o la clave ingresado no existen en la aplicación"
            );
            res.status(404).send(false);
          } else {
            console.log("BIENVENIDO AL SISTEMA DE INFORMACIÓN");
            res.status(200).send(true);
          }
        }
      );
    }
  } catch (error) {
    console.log("Hay un error en la conexión con el servidor");
    res.status(404).send(error);
  }
});

module.exports = usuario;
