//-- Creamos el servidor
//-- Creamos los 2 const, el http y el fs

const http = require('http');
const fs = require('fs');

//-- Cargamos las páginas a usar.
const ERROR = fs.readFileSync('error_page.html');
const MAIN = fs.readFileSync('Ej-07.html');

//-- Cargamos el fichero JSON
const PRODUCTOS = fs.readFileSync('productos.json');

//-- Sacamos los productos del fichero JSON
let productos = JSON.parse(PRODUCTOS);

//-- Creamos el SERVIDOR de atención al cliente.
const server = http.createServer((req,res)=>{

    const myURL = new URL(req.url, 'http://' + req.headers['host']);
    //-- Leer recurso
    let recurso = myURL.pathname;
    recurso = recurso.substr(1);
    
});
