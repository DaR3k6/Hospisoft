//Instanciamos los modulos requeridos
const express = require("express");

const app = express(); //Creamos nuestra aplicacion llamando el metodo constructor de express
app.use("/", require("./modules/usuarios.js"));
app.use("/", require("./modules/citas.js"));
app.use("/", require("./modules/contacto.js"));

app.listen("4000", () => {
  console.log("Aplicacion Ejecutandose en : http://localhost:4000");
});
