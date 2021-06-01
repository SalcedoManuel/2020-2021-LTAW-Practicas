const ip = require('ip');
const electron = require('electron');

console.log("Hola desde el proceso de la web...");

//-- Obtener elementos de la interfaz
const info_1 = document.getElementById("info_1");
const info_2 = document.getElementById("info_2");
const info_3 = document.getElementById("info_3");
const info_4 = document.getElementById("info_4");
const info_5 = document.getElementById("info_5");
const info_6 = document.getElementById("info_6");
const number_users = document.getElementById("number_users");
const display = document.getElementById("displays");
const button_test = document.getElementById("button_test");


//-- Acceder a la API de node para obtener la info
//-- Sólo es posible si nos han dado permisos desde
//-- el proceso princpal
info_1.textContent = process.arch;
info_2.textContent = process.platform;
info_3.textContent = process.cwd();
info_4.textContent = process.versions.node;
info_5.textContent = process.versions.chrome;
info_6.textContent = process.versions.electron;
number_users.textContent = 0;


electron.ipcRenderer.on('number_users', (event, message) => {
    console.log("Recibido: " + message);
    number_users.innerHTML = message;
});

electron.ipcRenderer.on('display', (event, message) => {
    console.log("Recibido: " + message);
    display.innerHTML += message + '<br>';
});

button_test.onclick = () => {
    console.log("Botón apretado!");
    //-- Enviar mensaje al proceso principal
    electron.ipcRenderer.invoke('test', "MENSAJE DE PRUEBA: Alea acta est");
}