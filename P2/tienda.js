//-- Imprimir información sobre la solicitud recibida

const http = require('http');
const fs = require('fs');
const PUERTO = 9000;

//-- Cargar la página de inicio.
const INICIO = fs.readFileSync('tienda_interfaz/index.html', 'utf-8');

//-- Cargar pagina web del formulario
const FORMULARIO = fs.readFileSync('tienda_interfaz/formulario.html','utf-8');

//-- Carga página web del formulario de dirección y la tarjeta de crédito.
const FORMULARIO_EXTRA = fs.readFileSync('tienda_interfaz/formulario-extra.html','utf-8');

//-- HTML de la página de respuesta
const RESPUESTA = fs.readFileSync('tienda_interfaz/respuesta.html', 'utf-8');

//-- HTML de la página de error
const ERROR_PAGE = fs.readFileSync('tienda_interfaz/error.html', 'utf-8');

//-- HTML del primer producto
const PRODUCTO1 = fs.readFileSync('tienda_interfaz/Producto1.html','utf-8');

//-- HTML del primer producto
const PRODUCTO2 = fs.readFileSync('tienda_interfaz/Producto2.html','utf-8');

//-- HTML del primer producto
const PRODUCTO3 = fs.readFileSync('tienda_interfaz/Producto3.html','utf-8');

//-- Cargar página web para finalizar la compra.
const FINISH_SHOPPING = fs.readFileSync('tienda_interfaz/finalizar_compra.html','utf-8');
//-- Nombre del fichero JSON a leer
const FICHERO_JSON = "tienda.json"

//-- Leer el fichero JSON
const  tienda_json = fs.readFileSync(FICHERO_JSON);

//-- Crear la estructura tienda a partir del contenido del fichero
const tienda = JSON.parse(tienda_json);

//-- Creamos el array que tendrá solamente el array de productos
const cubos_productos = [];

//-- Obtener el array de los productos
let cubos = JSON.parse(tienda_json);
cubos = cubos[0]["products"];
//-- Recorrer el array de productos
cubos.forEach((element, index)=>{
  let cubo = cubos[index]["name"];
  cubos_productos.push(cubo);
});

let result = [];

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
  let direction = myURL.searchParams.get('direction');
  let credit_card = myURL.searchParams.get('credit_card');
  

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
          if (tienda[1]["users"][index]["username"] == username &&
           tienda[1]["users"][index]["password"] == password){
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
        console.log("Error en el inicio de sesión, el usuario o la contraseña son incorrectas");
        html_extra = "<h2>Gracias por estar en nuestra tienda</h2>";
        content = content.replace("HTML_EXTRA", html_extra);
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
    list_productos.push("Cubo 2x2");
    if (list_products != null) {
      cabecera = "product="+ list_products + "Cubo 2x2&";
    }else{
      cabecera = "product="+ "Cubo 2x2&";
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
    list_productos.push("Cubo 3x3");
    if (list_products != null) {
      cabecera = "product="+ list_products + "Cubo 3x3&";
    }else{
      cabecera = "product="+ "Cubo 3x3&";
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
    list_productos.push("Cubo 4x4");
    if (list_products != null) {
      cabecera = "product="+ list_products + "Cubo 4x4&";
    }else{
      cabecera = "product="+ "Cubo 4x4&";
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
      if (user_cookie != null & list_products != null) {
          //-- Ponemos el HTML de producto comprado.
          content = FINISH_SHOPPING;
          //-- Poner el nombre de usuario
          content = content.replace("USUARIO",user_cookie);
          //-- Vamos a extraer los productos de la cookie.
          let pedidos = list_products.split("&");
          console.log(pedidos);
          //-- Averiguamos el número de pedidos realizados.
          number_orders = tienda[2]["pedidos"].length;
          //-- Creamos el pedido realizado.
          // tienda[2]["pedidos"][number_orders] = Crear_Pedido(user_cookie,"","",pedidos);
          //-- Averiguamos si tenemos suficiente stock para realizar el pedido.
          let pedido_sin_stock = false;
          let producto_sin_stock = "";
          //-- Con el fin de asegurar que tenemos el suficiente stock.
          let tienda_stock = tienda[0]["products"];
          pedidos.forEach((element, index) => {
            if (tienda_stock[0]["name"] == pedidos.index){
              if (tienda_stock[0][stock] != 0) {
                tienda_stock[0][stock] -= 1;
              }else{
                pedido_sin_stock = true;
                producto_sin_stock += "producto 1 ";
              }                
            }
            if (tienda_stock[1]["name"] == pedidos.index) {
              if (tienda_stock[1][stock] != 0) {
                tienda_stock[1][stock] -= 1;
              }else{
                pedido_sin_stock = true;
                producto_sin_stock += "producto 1 ";
              } 
            }
            if (tienda_stock[2]["name"] == pedidos.index) {
              if (tienda_stock[2][stock] != 0) {
                tienda_stock[2][stock] -= 1;
              }else{
                pedido_sin_stock = true;
                producto_sin_stock += "producto 1 ";
              } 
            }

          });
          //--Si no hay stock el pedido no se ejecuta la compra.
          if (pedido_sin_stock) {
            //-- Reseteamos la variable de la tienda puesto que no se realizará el pedido
            //-- por falta de stock.

            let frase = "¡No hay suficiente stock!";
            content = content.replace("¡Datos Recibidos!",frase);
            frase = "No tenemos suficiente stock de: " + producto_sin_stock + ". Intentelo mas tarde, ";
            content = content.replace("Gracias por su compra",frase);
            content = content.replace("Guardamos su pedido.", "Se ha reseteado su lista");
            console.log("NO TENEMOS STOCK POR AHORA");
            let cabecera = "product=";
            res.setHeader('Set-Cookie', cabecera);
            list_productos = [];
          }else{
            //-- Se ejecuta la compra.
            pedidos.forEach((element, index) => {
              console.log("-----------------------" + pedidos[index]);
              if (tienda[0]["products"][0]["name"] == pedidos[index]){
                console.log("--------------Stock del Producto 1: " + tienda[0]["products"][0]["stock"]);
                if (tienda[0]["products"][0]["stock"] != 0) {
                  tienda[0]["products"][0]["stock"] -= 1;
                }else{
                  pedido_sin_stock = true;
                  producto_sin_stock += "producto 1 ";
                }                
              }
              if (tienda[0]["products"][1]["name"] == pedidos[index]) {
                console.log("--------------Stock del Producto 2: " + tienda[0]["products"][1]["stock"]);
                if (tienda[0]["products"][1]["stock"] != 0) {
                  tienda[0]["products"][1]["stock"] -= 1;
                }else{
                  pedido_sin_stock = true;
                  producto_sin_stock += "producto 1 ";
                } 
              }
              if (tienda[0]["products"][2]["name"] == pedidos[index]) {
                console.log("--------------Stock del Producto 3: " + tienda[0]["products"][2]["stock"]);
                if (tienda[0]["products"][2]["stock"] != 0) {
                  tienda[0]["products"][2]["stock"] -= 1;
                  console.log("--------------Stock del Producto 3: " + tienda[0]["products"][2]["stock"]);
                }else{
                  pedido_sin_stock = true;
                  producto_sin_stock += "producto 1 ";
                } 
              }
            });
            //-- Convertir la variable a cadena JSON
            let myJSON = JSON.stringify(tienda);
            //-- Guardarla en el fichero destino
            fs.writeFileSync(FICHERO_JSON, myJSON);
            //-- Se continua el proceso de compra.
            content = FORMULARIO_EXTRA;
            content_type = "text/html";
          }
    }else{
       content = content.replace("<p></p>","Para hacer la compra hay que registrarse o tener al menos un producto.")
    }
  }
  if (myURL.pathname == '/procesar_compra') {
    //-- Cogemos la dirección y la tarjeta de crédito.
    content = RESPUESTA;
    //-- Averiguamos el número de pedidos realizados.
    number_orders = tienda[2]["pedidos"].length;
    //-- Vamos a extraer los productos de la cookie.
    let pedidos = list_products.split("&");
    //-- Creamos el pedido
    tienda[2]["pedidos"][number_orders] = Crear_Pedido(user_cookie,direction,credit_card,pedidos);
    //-- Borramos la información de la cookie
    cabecera = "product="+ "";
    res.setHeader('Set-Cookie', cabecera);
    //-- Convertir la variable a cadena JSON
    let myJSON = JSON.stringify(tienda);
    //-- Guardarla en el fichero destino
    fs.writeFileSync(FICHERO_JSON, myJSON);
  }
  if (myURL.pathname == '/productos') {
    console.log("Peticion de Productos!")
    content_type = "application/json";

    //-- Leer los parámetros
    let param1 = myURL.searchParams.get('param1');

    //-- Pasamos
    param1 = param1.toUpperCase();

    console.log("  Param: " +  param1);

    result = [];

    for (let prod of cubos_productos) {

        //-- Pasar a mayúsculas
        prodU = prod.toUpperCase();

        //-- Si el producto comienza por lo indicado en el parametro
        //-- meter este producto en el array de resultados
        if (prodU.startsWith(param1)) {
            result.push(prod);
        }
        
    }
    console.log("Lista: " + result);
    content = JSON.stringify(result);
  }else if (myURL.pathname == '/cliente.js') {
    //-- Leer fichero javascript
    console.log("recurso: " + (myURL.pathname));
    let recurso = myURL.pathname;
    recurso = recurso.substr(1); 
    fs.readFile(recurso, 'utf-8', (err,data) => {
        if (err) {
            console.log("Error: " + err)
            return;
        } else {
          res.setHeader('Content-Type', 'application/javascript');
          res.write(data);
          res.end();
        }
    });
    
    return;
  }else if (myURL.pathname == '/busqueda') {
     //-- Nos quedamos con el primer valor que aparece en la búsqueda
     if (result.length != 0){
      console.log("Enviar a la página de " + result[0]);
      if (result[0] == tienda[0]["products"][0]["name"]) {
        content = PRODUCTO1;
      }else if (result[0] == tienda[0]["products"][1]["name"]) {
        content = PRODUCTO2;
      }else if (result[0] == tienda[0]["products"][2]["name"]) {
        content = PRODUCTO3;
      }
      
     }
  //-- Si no es ninguna de las anteriores devolver mensaje de error
  }
  console.log(myURL.pathname)
  if (myURL.pathname == '/tienda_interfaz/css/index-style.css'||
      myURL.pathname == '/tienda_interfaz/css/producto-style.css' ||
      myURL.pathname == '/tienda_interfaz/css/formulario-style.css') {
    let recurso = myURL.pathname;
    recurso = recurso.substr(1);
    fs.readFile(recurso, 'utf-8', (err,data) => {
      if (err) {
          console.log("Error: " + err)
          return;
      } else {
        res.setHeader('Content-Type', 'text/css');
        res.write(data);
        res.end();
      }
    });
    return
  }
  if (myURL.pathname == '/tienda_interfaz/css/cubo_2x2.png' ||
      myURL.pathname == '/tienda_interfaz/css/cubo_3x3.png' ||
      myURL.pathname == '/tienda_interfaz/css/cubo_4x4.png' ||
      myURL.pathname == '/tienda_interfaz/css/logo_small.png'){
    let recurso = myURL.pathname;
    recurso = recurso.substr(1);
    fs.readFile(recurso,(err,data) => {
      if (err) {
          console.log("Error: " + err)
          return;
      } else {
        res.setHeader('Content-Type', 'image/png');
        res.write(data);
        res.end();
      }
    });
    return
  }
  


  //-- Enviar la respuesta
  res.setHeader('Content-Type', content_type);
  res.write(content);
  res.end()

});

server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);
