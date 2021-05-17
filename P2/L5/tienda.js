//-- Lectura y modificación de un fichero JSON
const fs = require('fs');

//-- Npmbre del fichero JSON a leer
const FICHERO_JSON = "tienda.json"

//-- Leer el fichero JSON
const  tienda_json = fs.readFileSync(FICHERO_JSON);

//-- Crear la estructura tienda a partir del contenido del fichero
const tienda = JSON.parse(tienda_json);

//-- Mostrar informacion sobre la tienda
console.log("Productos en la tienda: " + tienda.length);

//-- Recorrer el array de productos

tienda[1]["lista_productos"]["producto1"]["stock"] += 1;
tienda[1]["lista_productos"]["producto2"]["stock"] += 1;
tienda[1]["lista_productos"]["producto3"]["stock"] += 1;

//-- Mostrar informacion sobre la tienda
console.log("Stock del Producto 1: " + tienda[1]["lista_productos"]["producto1"]["stock"]);
console.log("Stock del Producto 2: " + tienda[1]["lista_productos"]["producto2"]["stock"]);
console.log("Stock del Producto 3: " + tienda[1]["lista_productos"]["producto3"]["stock"]);

