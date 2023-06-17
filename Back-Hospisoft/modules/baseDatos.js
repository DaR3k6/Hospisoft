const mysql = require("mysql"); //Instanciamos el modulo MYSQL

//Creamos la conexion
const conexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "agenda2",
});

//Nos conectamos a la BD
conexion.connect(error => {
  if (error) {
    // throw "Existe un error en la cadena de conexion";
    console.log(`Hay en un error: ${error}`);
  } else {
    console.log("Conexion Exitosa!");
  }
});
//Exporta este modulo para usarlo en otros modulos principio SRP Single-responsibility principle
module.exports = conexion;
