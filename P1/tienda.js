//-- Creación de las constantes
const http = require('http');
const url = require('url');
const fs = require('fs');
const PUERTO = 9000;


http.createServer((req, res) => {
  console.log("---> Peticion recogida")
  let q = url.parse(req.url, true);  
  var tipo = q.pathname.split(".")[1];
  console.log("Recurso:" + q.pathname);
  
  let filename = "";

  //-- Obtener fichero a devolver
  switch (q.pathname) {
    
    //-- Pagina principal
    case "/":
      filename = "index.html";
      break;
    //-- Pagina de acceso
    default:
    filename = q.pathname.substr(1);
  }
    let mime = "";
   
    switch (tipo) {
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

    res.writeHead(200, {'Content-Type': mime});
    res.write(data);
    res.end();
  });
}).listen(PUERTO);

console.log("Servidor corriendo...")
console.log("Puerto: " + PUERTO)