const http = require('http');
const url = require('url');
const fs = require('fs');
const PUERTO = 9000;

//-- Npmbre del fichero JSON a leer
const FICHERO_JSON = "tienda.json"

//-- Leer el fichero JSON
const  tienda_json = fs.readFileSync(FICHERO_JSON);

//-- Crear la estructura tienda a partir del contenido del fichero
const store = JSON.parse(tienda_json);

const tienda = store[0]["products"];

let myJSON = JSON.stringify(tienda);

products = tienda[0]["products"];
http.createServer((req, res) => {
  console.log("----------> Peticion recibida")
  let q = url.parse(req.url, true);
  console.log("Recurso:" + q.pathname)
  var recurso = q.pathname.split("/")[2];
  var tipo = q.pathname.split(".")[1]
  const cookie = req.headers.cookie;
  const params = q.query;
  
  let filename = "";

  //-- Obtener fichero a devolver
  switch (q.pathname) {

    //-- Pagina principal
    case "/":
      filename = "index.html";
      break;
    case "/productos":
       filename = "tienda.json";
       recurso = "tienda";
       tipo = "json"
       break 
    //-- Pagina de acceso
    default:
    filename = q.pathname.substr(1);
  }
    var extension = tipo;
    let mime = "";
    switch (extension) {
      case "js":
        mime = "application/js"
      case "json":
        mime = "application/json";
        break;
      case "jpg":
        mime = "image/jpg";
        break;
      case "png":
        mime = "image/png";
        break;
      case "ico":
        mime = "image/ico";
        break;
      case "html":
        mime = "text/html";
        break;
      case "css":
        mime = "text/css";
        break;
      case "svg":
        mime = "image/svg+xml";
        break;
      default:
        mime = "text/html";
    }

    fs.readFile(filename, function(err, data) {

      if (err) {
        res.writeHead(404, {'Content-Type': 'na'});
        return res.end("404 Not Found");
      }
      if (filename = "tienda.json"){
        res.writeHead(200, {'Content-Type': 'json'});
        res.write(myJSON);
        res.end();
      }else{
        res.writeHead(200, {'Content-Type': mime});
        res.write(data);
        res.end();
      }
  });
}).listen(PUERTO);

console.log("Servidor corriendo...")
console.log("Puerto: " + PUERTO)