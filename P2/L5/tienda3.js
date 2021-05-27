//-- Lectura y modificación de un fichero JSON
const fs = require('fs');

//-- Npmbre del fichero JSON a leer
const FICHERO_JSON = "tienda.json"


//-- Leer el fichero JSON
const  tienda_json = fs.readFileSync(FICHERO_JSON);

//-- Crear la estructura tienda a partir del contenido del fichero
const tienda = JSON.parse(tienda_json);


//-- Número de productos en la tienda
console.log("Número de productos: " + tienda[0]["products"].length);

//-- Listado de Productos
tienda[0]["products"].forEach((element, index) => {
  tienda[0]["products"][index]["stock"] +=  1;
  console.log("-- Stock del Producto " + element["name"] + ": " + element["stock"]);
});

//-- Convertir la variable a cadena JSON
let myJSON = JSON.stringify(tienda);

//-- Guardarla en el fichero destino
fs.writeFileSync(FICHERO_JSON, myJSON);

console.log("Información guardada en fichero: " + FICHERO_JSON);
