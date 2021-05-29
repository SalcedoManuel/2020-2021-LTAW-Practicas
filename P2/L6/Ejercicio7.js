//-- Imprimir información sobre la solicitud recibida

const http = require('http');
const fs = require('fs');
const PUERTO = 9000;

//-- Cargar la página de inicio.
const INICIO = fs.readFileSync('Index-Ejercicio6.html', 'utf-8');

//-- Cargar pagina web del formulario
const FORMULARIO = fs.readFileSync('Formulario-Ejercicio2.html','utf-8');

//-- HTML de la página de respuesta
const RESPUESTA = fs.readFileSync('Respuesta-Ejercicio2.html', 'utf-8');

//-- HTML de la página de error
const ERROR_PAGE = fs.readFileSync('Error-Ejercicio2.html', 'utf-8');

//-- HTML del primer producto
const PRODUCTO1 = fs.readFileSync('Producto1-Ejercicio7.html','utf-8');

//-- HTML del primer producto
const PRODUCTO2 = fs.readFileSync('Producto3-Ejercicio7.html','utf-8');

//-- HTML del primer producto
const PRODUCTO3 = fs.readFileSync('Producto3-Ejercicio7.html','utf-8');

//-- Cargar página web para finalizar la compra.
const FINISH_SHOPPING = fs.readFileSync('finalizar_compra.html','utf-8');
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

var list_productos = [];
//-- SERVIDOR: Bucle principal de atención a clientes
const server = http.createServer((req, res) => {

  //-- Construir el objeto url con la url de la solicitud
  const myURL = new URL(req.url, 'http://' + req.headers['host']);  

  //-- Leer los parámetros
  let username = myURL.searchParams.get('username');
  let password = myURL.searchParams.get('password');
  

  //-- Por defecto entregar la página de inicio.
  let content_type = "text/html";
  let content = INICIO;

  let user_cookie = get_user(req);
  console.log("Averiguar la cookie: " + user_cookie);
  //--
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
                let cabecera = "user=" + username;
                res.setHeader('Set-Cookie', cabecera);
                //-- Reemplazar las palabras claves por su valores
                //-- en la plantilla HTML
                let enlace = "<a href='/formulario'>Login</a>";
                let usuario = "Bienvenido " + username;
                content = INICIO.replace(enlace,usuario);
                let extra = "<p>Si quiere iniciar sesión pulsa el botón de abajo</p>";
                content = content.replace(extra, "COMPREE");
            }
      });
      if (user_error) {
        content = ERROR_PAGE;
        console.log("Error en el inicio de sesión");
        html_extra = "<h2>Gracias por estar en nuestra tienda</h2>";
        content = ERROR_PAGE.replace("HTML_EXTRA", html_extra);
      }
  }
  if (myURL.pathname == '/formulario') {
    let content_type = "text/html";  
    content = FORMULARIO;
  }
  if (myURL.pathname == '/producto1') {
    content = PRODUCTO1;
    let new_message = "carro: " + list_productos.length;
    console.log(list_productos)
    content = PRODUCTO1.replace("carro: 0",new_message)
    content_type = "text/html";
  }
  if (myURL.pathname == '/producto2') {
    content = PRODUCTO2;
    let new_message = "carro: " + list_productos.length;
    console.log(list_productos)
    content = PRODUCTO1.replace("carro: 0",new_message)
    content_type = "text/html";
  }
  if (myURL.pathname == '/producto3') {
    content = PRODUCTO3;
    let new_message = "carro: " + list_productos.length;
    console.log(list_productos)
    content = PRODUCTO1.replace("carro: 0",new_message)
    content_type = "text/html";
  }

  if (myURL.pathname == '/carrito-producto1') {
      list_productos.push("cubo 2x2");
      let cabecera = "&Carrito";
      res.setHeader('Set-Cookie', cabecera);
      console.log(list_productos);
      content = INICIO;
  }
  if (myURL.pathname == '/carrito-producto2') {
    list_productos.push("cubo 3x3");
    console.log(list_productos);
    content = INICIO;
  }
  if (myURL.pathname == '/carrito-producto3') {
    list_productos.push("cubo 4x4");
    console.log(list_productos);
    content = INICIO;
  }
  if (myURL.pathname == '/finalizar_compra') {
      if (user_cookie != null) {
          content = FINISH_SHOPPING;
          list_productos = [];
      }else{
          content = content.replace("<p></p>","Para hacer la compra hay que registrarse")
      }
  }

    //-- Enviar la respuesta
    res.setHeader('Content-Type', content_type);
    res.write(content);
    res.end()

});

server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);
