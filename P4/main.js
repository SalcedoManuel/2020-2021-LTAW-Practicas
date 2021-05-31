//-- Cargar el módulo de electron
const electron = require('electron');
//-- Cargar el módulo de socket
const socket  =requiere('socket.io');
//-- Cargar el módulo http
const http = requiere('http');
//-- Cargar el módulo express
const express = requiere('express');
//-- Cargar módulo de colores
const colors = require('colors');

//-- Valor del puerto del chat
const PUERTO = 9000;

//-- Número de concexiones recibidas.
var number_connections = 0;

//-- Crear una nueva aplicación web
const app = express();

//-- Crear un servidor, asosiaco a la App de express
const server = http.Server(app);

//-- Crear el servidor de websockets, asociado al servidor http
const io = socket(server);

console.log("Arrancando electron...");

//-- Variable para acceder a la ventana principal
//-- Se pone aquí para que sea global al módulo principal
let win = null;

//-- Punto de entrada. En cuanto electron está listo,
//-- ejecuta esta función
electron.app.on('ready', () => {
    console.log("Evento Ready!");

    //-- Crear la ventana principal de nuestra aplicación
    win = new electron.BrowserWindow({
        width: 600,   //-- Anchura 
        height: 600,  //-- Altura

        //-- Permitir que la ventana tenga ACCESO AL SISTEMA
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
    });

  //-- En la parte superior se nos ha creado el menu
  //-- por defecto
  //-- Si lo queremos quitar, hay que añadir esta línea
  win.setMenuBarVisibility(false)

  //-- Cargar contenido web en la ventana
  //-- La ventana es en realidad.... ¡un navegador!
  //win.loadURL('https://www.urjc.es/etsit');

  //-- Cargar interfaz gráfica en HTML
  win.loadFile("index.html");

  //-- Esperar a que la página se cargue y se muestre
  //-- y luego enviar el mensaje al proceso de renderizado para que 
  //-- lo saque por la interfaz gráfica
  win.on('ready-to-show', () => {
    win.webContents.send('print', "MENSAJE ENVIADO DESDE PROCESO MAIN");
  });

  //-- Enviar un mensaje al proceso de renderizado para que lo saque
  //-- por la interfaz gráfica
  win.webContents.send('print', "MENSAJE ENVIADO DESDE PROCESO MAIN");

});


//-- Esperar a recibir los mensajes de botón apretado (Test) del proceso de 
//-- renderizado. Al recibirlos se escribe una cadena en la consola
electron.ipcMain.handle('test', (event, msg) => {
  console.log("-> Mensaje: " + msg);
});
