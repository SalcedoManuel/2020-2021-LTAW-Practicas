//-- Cargar las dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');

//-- Número de conexiones recibidas.
var number_connections = 0;

const PUERTO = 9000;

//-- Crear una nueva aplciacion web
const app = express();

//-- Crear un servidor, asosiaco a la App de express
const server = http.Server(app);

//-- Crear el servidor de websockets, asociado al servidor http
const io = socket(server);

//-------- PUNTOS DE ENTRADA DE LA APLICACION WEB
//-- Definir el punto de entrada principal de mi aplicación web
app.get('/', (req, res) => {
  res.send('Bienvenido al Foro Romano!!! ---> ' + '<a href="/chat.html">Entrar</a>');
});

//-- Esto es necesario para que el servidor le envíe al cliente la
//-- biblioteca socket.io para el cliente
app.use('/', express.static(__dirname +'/'));

//-- El directorio publico contiene ficheros estáticos
app.use(express.static('public'));

//------------------- GESTION SOCKETS IO
//-- Evento: Nueva conexion recibida
io.on('connect', (socket) => {
  
  console.log('** NUEVA CONEXIÓN **'.yellow);
  number_connections += 1;
  msg = "Un senador entró en el foro."
  io.send(msg);
  //-- Evento de desconexión
  socket.on('disconnect', function(){
    console.log('** CONEXIÓN TERMINADA **'.yellow);
    number_connections -= 1;
  });  

  //-- Mensaje recibido: Reenviarlo a todos los clientes conectados
  socket.on("message", (msg)=> {
    console.log("Mensaje Recibido!: " + msg.blue);
    if(msg == "/help"){
        msg = "Esta es la lista de comandos: <br>" + 
               "<b>/help</b>" + " : Muestra la lista con los comandos soportados<br>" + 
               "<b>/list</b>" + " : Devolverá el número de usuarios conectados<br>" + 
               "<b>/hello</b>" + " : El servidor nos devolverá el saludo<br>" + 
               "<b>/date</b>" + " : Nos devolverá la fecha<br>" + 
               "<b>/clean</b>" + " : Limpia todo el display<br>";
        console.log("Enviamos lista de comandos".red)
        socket.send(msg);
    }else if (msg == "/list"){
        msg = "Este el número de usuarios conectados: " + "<b>"+number_connections+ "</b>";
        socket.send(msg); 
    }else if (msg == "/hello"){
        msg = "<b> El servidor que os da cobijo os saluda </b>"
        socket.send(msg);
    }else if (msg == "/date") {
        var date = new Date(Date.now());
        msg = "La fecha es:" + "<b>" + date + "</b>";
        socket.send(msg);
    }else if(msg == "/clean"){
      msg = "/clean/"
      socket.send(msg);
    }else{
        //-- Reenviarlo a todos los clientes conectados
        io.send(msg);
    }
  });

});

//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);
