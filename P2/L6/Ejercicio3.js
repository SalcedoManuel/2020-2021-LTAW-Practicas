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

//-- HTML de la página de compra
const COMPRA = fs.readFileSync('Compra-Ejercicio3.html', 'utf-8');

//-- Nombre del fichero JSON a leer
const FICHERO_JSON = "tienda.json"

//-- Leer el fichero JSON
const  tienda_json = fs.readFileSync(FICHERO_JSON);

//-- Crear la estructura tienda a partir del contenido del fichero
const tienda = JSON.parse(tienda_json);

var user_name = "";
//-- SERVIDOR: Bucle principal de atención a clientes
const server = http.createServer((req, res) => {

  //-- Construir el objeto url con la url de la solicitud
  const myURL = new URL(req.url, 'http://' + req.headers['host']);

  //-- Leer los parámetros
  let username = myURL.searchParams.get('username');
  let password = myURL.searchParams.get('password');
  let direction = myURL.searchParams.get('direction');
  let card_number = myURL.searchParams.get('credit card');

  //-- Por defecto entregar formulario
  let content_type = "text/html";
  let content = FORMULARIO;

  //-- Función para crear un pedido.
  function Crear_Pedido(username,direction,card_number) {
    pedido = new Object();
    pedido.username = username;
    pedido.direction = direction;
    pedido.card_number = card_number;
    pedido.products = {};
    return pedido;
}


  if (myURL.pathname == '/procesar') {

      content_type = "text/html";
      //-- user_error sirve para saber si el usuario está o no en la lista.
      let user_error = true;
      //-- Buscamos en la lista del JSON si el usario está disponible
      tienda[1]["users"].forEach((element, index) => {
          //-- Si el usuario está en la lista entra en el if.
          if (tienda[1]["users"][index]["username"] == username){
            //-- Enviamos la nueva página web.
            content = COMPRA;
            user_name = username;
            //-- El usuario está en la lista.
            user_error = false;
        }
      });
      //-- Si el usuario no está en la lista se envía otra página.
      if (user_error) {
        content = ERROR_PAGE;
        console.log("Error en el inicio de sesión");
        html_extra = "<h2>Gracias por estar en nuestra tienda</h2>";
        content = ERROR_PAGE.replace("HTML_EXTRA", html_extra);
      }
  }
  if (myURL.pathname == '/compra') {
    content_type = "text/html";

    //-- Buscamos en la lista del JSON y añadimos el pedido.
    number_orders = tienda[2]["pedidos"].length;
    username = user_name;
    //-- Crear el formato del pedido.
    tienda[2]["pedidos"][number_orders] = Crear_Pedido(username,direction,card_number);

    
    //-- Convertir la variable a cadena JSON
    let myJSON = JSON.stringify(tienda);
    //-- Guardarla en el fichero destino
    fs.writeFileSync(FICHERO_JSON, myJSON);

    content = RESPUESTA;
    //-- Reemplazar las palabras claves por su valores
    //-- en la plantilla HTML
    content = RESPUESTA.replace("USERNAME", username);
    content = content.replace("PASSWORD", password);
    //-- Si el usurio es root se modifica el HTML extra
    let html_extra = "<h2>Gracias por comprar en nuestra tienda</h2>";
    content = content.replace("HTML_EXTRA", html_extra);
  }

    //-- Enviar la respuesta
    res.setHeader('Content-Type', content_type);
    res.write(content);
    res.end()

});

server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);
