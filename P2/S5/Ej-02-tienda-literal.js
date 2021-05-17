//-- Cadena con la estructura de la tienda en JSON
const tienda_json = `[
  {
    "nombre": "Alhambra II",
    "descripcion": "Placa con FPGA ice40HX8K",
    "stock": 3
  },
  {
    "nombre": "Icestick",
    "stock": 10
  }
]`
// Para obtener una variable a partir de un texto en JSON utilizamos el método.
// JSON.parse(cadena)
//-- Crear la estructura tienda a partir de la cadena en json
//-- Convierte a JSON una lista de caracteres.
const tienda = JSON.parse(tienda_json);

//-- Después de obtener la lista en JSON. 

//-- Mostrar informacion sobre la tienda
console.log("Productos en la tienda: " + tienda.length);

//-- Recorrer el array de productos
tienda.forEach((element, index)=>{
  console.log("Producto: " + (index + 1) + ": " + element["nombre"]);
});