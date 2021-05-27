//-- Lectura y modificación de un fichero JSON
const fs = require('fs');

//-- Npmbre del fichero JSON a leer
const FICHERO_JSON = "tienda.json"

//-- NOmbre del fichero JSON de salida
const FICHERO_JSON_OUT = "tienda2-modificacion.json"

//-- Leer el fichero JSON
const  tienda_json = fs.readFileSync(FICHERO_JSON);

//-- Crear la estructura tienda a partir del contenido del fichero
const tienda = JSON.parse(tienda_json);

//-- Se muestra el número de usuarios registrados:
console.log("Número de usuarios registrados: " + tienda[1]["users"].length);

//-- Listado con los nombres de los usuarios.
tienda[1]["users"].forEach((element, index) => {
  console.log("Usuario: " + (index + 1) + ": " + element["username"]);
});

//-- Número de productos en la tienda
console.log("Número de productos: " + tienda[0]["products"].length);

//-- Listado de Productos
tienda[0]["products"].forEach((element, index) => {
  console.log("-- Stock del Producto " + element["name"] + ":" + element["stock"]);
});

//-- Mostrar informacion sobre los pedidos
console.log("Productos en la tienda: " + tienda[2]["pedidos"].length);



//-- Convertir la variable a cadena JSON
let myJSON = JSON.stringify(tienda);

//-- Guardarla en el fichero destino
fs.writeFileSync(FICHERO_JSON_OUT, myJSON);

console.log("Información guardada en fichero: " + FICHERO_JSON_OUT);
