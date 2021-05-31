const ip = require('ip');
const electron = require('electron');
const QRCode = require('qrcode');

//-- Obtener elementos de la interfaz
const info1 = document.getElementById("info1");
const info2 = document.getElementById("info2");
const info3 = document.getElementById("info3");
const direccion_ip = document.getElementById("direccionip");
const info_users = document.getElementById("info_users");
const mensajes = document.getElementById("mensajes");
const mensaje = document.getElementById("mensaje");
const button_test = document.getElementById("button_test");
const qr = document.getElementById("qr");

//-- Acceder a la API de node para obtener la info
//-- Sólo es posible si nos han dado permisos desde
//-- el proceso princpal
info1.textContent = process.versions.node;
info2.textContent = process.versions.chrome;
info3.textContent = process.versions.electron;
info_users.textContent = 0;
info_1.textContent = process.arch;
info_2.textContent = process.platform;
info_3.textContent = process.cwd();


electron.ipcRenderer.on('print-ip', (event, message) => {
    console.log("Recibido: " + message);
    direccion_ip.textContent = message;
});

electron.ipcRenderer.on('print-users', (event, message) => {
    console.log("Recibido: " + message);
    info_users.innerHTML = message;
});

electron.ipcRenderer.on('print-msg', (event, message) => {
    console.log("Recibido: " + message);
    mensajes.innerHTML = message + '<br>' + mensajes.innerHTML;
    mensaje.scrollTop = mensaje.scrollHeight;
});

button_test.onclick = () => {
    console.log("Botón apretado!");

    //-- Enviar mensaje al proceso principal
    electron.ipcRenderer.invoke('test', "MENSAJE DE PRUEBA: Alea Iacta Est 'La suerte está echada'");
}