//-- Imprimir información sobre la solicitud recibida

const http = require('http');
const fs = require('fs');
const PUERTO = 9000;

//-- Cargar pagina web del formulario
const FORMULARIO = fs.readFileSync('Formulario-Ejercicio2.html','utf-8');

//-- HTML de la página de respuesta
const RESPUESTA = fs.readFileSync('Respuesta-Ejercicio2.html', 'utf-8');

//-- HTML de la página de error
const ERROR_PAGE = fs.readFileSync('Error-Ejercicio2.html', 'utf-8');

//-- Nombre del fichero JSON a leer
const FICHERO_JSON = "tienda.json"

//-- Leer el fichero JSON
const  tienda_json = fs.readFileSync(FICHERO_JSON);

//-- Crear la estructura tienda a partir del contenido del fichero
const tienda = JSON.parse(tienda_json);


//-- SERVIDOR: Bucle principal de atención a clientes
const server = http.createServer((req, res) => {

  //-- Construir el objeto url con la url de la solicitud
  const myURL = new URL(req.url, 'http://' + req.headers['host']);  

  //-- Leer los parámetros
  let username = myURL.searchParams.get('username');
  let password = myURL.searchParams.get('password');
  if (username == "null") {
    console.log(" Username: " + username);
    console.log(" Password: " + password);
  }
  

  //-- Por defecto entregar formulario
  let content_type = "text/html";
  let content = FORMULARIO;

  if (myURL.pathname == '/procesar') {
      content_type = "text/html";
        //-- error sirve para saber si el usuario está o no en la lista.
        let error = true;
      tienda.forEach((element, index) => {
          if (element["username"] == username){
             //-- Reemplazar las palabras claves por su valores
             //-- en la plantilla HTML
             content = RESPUESTA.replace("NOMBRE", username);
             content = content.replace("PASSWORD", password);
             //-- Si el usurio es root se modifica el HTML extra
             let html_extra = "";
             if (username=="root" && password=="Norris") {
                html_extra = "<h2>Chuck Norris no necesita registrarse</h2>";
             }
             content = content.replace("HTML_EXTRA", html_extra);
             //-- El usuario está en la lista.
             error = false;
            }
      });
      if (error) {
        content = ERROR_PAGE;
        console.log("Error en el inicio de sesión");
        html_extra = "<h2>Gracias por estar en nuestra tienda</h2>";
        content = ERROR_PAGE.replace("HTML_EXTRA", html_extra);
      }
  }

    //-- Enviar la respuesta
    res.setHeader('Content-Type', content_type);
    res.write(content);
    res.end()

});

server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);
