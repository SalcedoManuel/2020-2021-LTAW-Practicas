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
const PRODUCTO2 = fs.readFileSync('Producto2-Ejercicio7.html','utf-8');

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
      console.log(cookie);
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

  function get_products(req) {

    //-- Leer la Cookie recibida
    const cookie = req.headers.cookie;
  
    //-- Hay cookie
    if (cookie) {
      
      //-- Obtener un array con todos los pares nombre-valor
      let pares = cookie.split(";");
      
      //-- Variable para guardar el usuario
      let product;
  
      //-- Recorrer todos los pares nombre-valor
      pares.forEach((element, index) => {
  
        //-- Obtener los nombres y valores por separado
        let [nombre, valor] = element.split('=');
  
        //-- Leer el usuario
        //-- Solo si el nombre es 'product'
        if (nombre.trim() === 'product') {
          product = valor;
        }
      });
  
      //-- Si la variable user no está asignada
      //-- se devuelve null
      return product || null;
    }
  }

    //-- Función para crear un pedido.
    function Crear_Pedido(username,direction,card_number,products) {
        pedido = new Object();
        pedido.username = username;
        pedido.direction = direction;
        pedido.card_number = card_number;
        pedido.products = products;
        return pedido;
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
  let list_products = get_products(req);
  console.log("Averiguar la cookie del usuario: " + user_cookie);
  console.log("Averiguar la cookie de la lista de productos: " + list_products);
  //--
  if (myURL.pathname == '/' && user_cookie != null) {
    content = INICIO;
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
                cabecera = "user=" + username;
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
    content = PRODUCTO2.replace("carro: 0",new_message)
    content_type = "text/html";
  }
  if (myURL.pathname == '/producto3') {
    content = PRODUCTO3;
    let new_message = "carro: " + list_productos.length;
    console.log(list_productos)
    content = PRODUCTO3.replace("carro: 0",new_message)
    content_type = "text/html";
  }

  if (myURL.pathname == '/carrito-producto1') {
    list_productos.push("cubo 2x2");
    if (list_products != null) {
      cabecera = "product="+ list_products + "cubo2x2&";
    }else{
      cabecera = "product="+ "cubo2x2&";
    }
    res.setHeader('Set-Cookie', cabecera);
    content = INICIO;
    if (user_cookie) {
        //-- Reemplazar las palabras claves por su valores
        //-- en la plantilla HTML
        let enlace = "<a href='/formulario'>Login</a>";
        let usuario = "Bienvenido " + user_cookie;
        content = INICIO.replace(enlace,usuario);
    }

  }

  if (myURL.pathname == '/carrito-producto2') {
    list_productos.push("cubo 3x3");
    if (list_products != null) {
      cabecera = "product="+ list_products + "cubo3x3&";
    }else{
      cabecera = "product="+ "cubo3x3&";
    }
    res.setHeader('Set-Cookie', cabecera);
    content = INICIO;
    if (user_cookie) {
        //-- Reemplazar las palabras claves por su valores
        //-- en la plantilla HTML
        let enlace = "<a href='/formulario'>Login</a>";
        let usuario = "Bienvenido " + user_cookie;
        content = INICIO.replace(enlace,usuario);
    }
  }

  if (myURL.pathname == '/carrito-producto3') {
    list_productos.push("cubo 4x4");
    if (list_products != null) {
      cabecera = "product="+ list_products + "cubo4x4&";
    }else{
      cabecera = "product="+ "cubo4x4&";
    }
    res.setHeader('Set-Cookie', cabecera);
    content = INICIO;
    if (user_cookie) {
        //-- Reemplazar las palabras claves por su valores
        //-- en la plantilla HTML
        let enlace = "<a href='/formulario'>Login</a>";
        let usuario = "Bienvenido " + user_cookie;
        content = INICIO.replace(enlace,usuario);
    }
  }
  if (myURL.pathname == '/finalizar_compra') {
      if (user_cookie != null) {
          content = FINISH_SHOPPING;
          content = content.replace("USUARIO",user_cookie);
          //-- Vamos a extraer los productos de la cookie.
          let pedidos = list_products.split("&");
          //-- Guardamos la información en el apartado pedidos.
          number_orders = tienda[2]["pedidos"].length;
          tienda[2]["pedidos"][number_orders] = Crear_Pedido(user_cookie,"","",pedidos)
          pedidos.forEach((element, index) => {
            if (tienda[0]["products"][0]["name"] == pedidos.index){
                tienda[0]["products"][0][stock] -= 1;
            }
            if (tienda[0]["products"][1]["name"] == pedidos.index) {
                tienda[0]["products"][0][stock] -= 1;
            }
            if (tienda[0]["products"][2]["name"] == pedidos.index) {
                tienda[0]["products"][0][stock] -= 1;
            }
        });
          let cabecera = "product=";
          res.setHeader('Set-Cookie', cabecera);
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
