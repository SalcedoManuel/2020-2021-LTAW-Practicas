//-- Crear la variable tienda, que es una estructura formada
//-- por dos productos
const tienda = [
  { //-- Lista de productos a la venta.
    nombre: "Alhambra II",
    descripcion: "Placa con FPGA ice40HX8K",
    stock: 3
  },
  {
    nombre: "Icestick",
    stock: 10
  }
];

//-- Mostrar informacion sobre la tienda utilizando el variable.length
console.log("Productos en la tienda: " + tienda.length);

//-- Recorrer el array de productos
tienda.forEach((element, index)=>{
  console.log("Producto: " + (index + 1) + ": " + element.nombre +
               " stock: " + element.stock);
});