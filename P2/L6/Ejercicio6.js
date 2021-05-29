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

function get_user(req) {

    //-- Leer la Cookie recibida
    const cookie = req.headers.cookie;
  
    //-- Hay cookie
    if (cookie) {
      
      //-- Obtener un array con todos los pares nombre-valor
      let pares = cookie.split(";");
      
      //-- Variable para guardar el usuario
      let user;
  
      //-- Recorrer todos los pares nombre-valor
      pares.forEach((element, index) => {
  
        //-- Obtener los nombres y valores por separado
        let [nombre, valor] = element.split('=');
  
        //-- Leer el usuario
        //-- Solo si el nombre es 'user'
        if (nombre.trim() === 'user') {
          user = valor;
        }
      });
  
      //-- Si la variable user no está asignada
      //-- se devuelve null
      return user || null;
    }
  }


//-- SERVIDOR: Bucle principal de atención a clientes
const server = http.createServer((req, res) => {

  //-- Construir el objeto url con la url de la solicitud
  const myURL = new URL(req.url, 'http://' + req.headers['host']);  

  //-- Leer los parámetros
  let username = myURL.searchParams.get('username');
  let password = myURL.searchParams.get('password');
  

  //-- Por defecto entregar formulario
  let content_type = "text/html";
  let content = FORMULARIO;

  let user_cookie = get_user(req);
  console.log("Averiguar la cookie: " + user_cookie)
  if (myURL.pathname == '/' && user_cookie != null) {
    content = RESPUESTA;
    content = content.replace("USERNAME",user_cookie);
    content = content.replace("PASSWORD","oculta por seguridad");
    let html_extra = "";
    content = content.replace("HTML_EXTRA", html_extra);
}
  if (myURL.pathname == '/procesar' && user_cookie == null) {
      content_type = "text/html";
        //-- error sirve para saber si el usuario está o no en la lista.
        let user_error = true;

      tienda[1]["users"].forEach((element, index) => {
          if (tienda[1]["users"][index]["username"] == username){
                //-- El usuario está en la lista.
                user_error = false;
                //-- Asignar la cookie de usuario.
                console.log("Añadir la cabecera")
                res.setHeader('Set-Cookie', "user="+username);
                //-- Reemplazar las palabras claves por su valores
                //-- en la plantilla HTML
                content = RESPUESTA.replace("USERNAME", username);
                content = content.replace("PASSWORD", password);
                //-- Si el usurio es root se modifica el HTML extra
                let html_extra = "";
                content = content.replace("HTML_EXTRA", html_extra);
            }
      });
      if (user_error) {
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
