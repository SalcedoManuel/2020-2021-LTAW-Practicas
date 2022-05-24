//-- Elementos del interfaz
const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");

//-- Crear un websocket. Se establece la conexión con el servidor
const socket = io();


socket.on("message", (msg)=>{
  if (msg == "/clean/") {
    display.innerHTML = "";
  }else{
    display.innerHTML = '<p style="color:blue">' + msg + '</p>' + display.innerHTML;
  }
});

//-- Al apretar el botón se envía un mensaje al servidor
msg_entry.onchange = () => {
  if (msg_entry.value)
    socket.send(msg_entry.value);
    document.getElementById("chat").style.display = "block";
  
  //-- Borrar el mensaje actual
  msg_entry.value = "";
}

//-- Al apretar el botón se envía el registro al servidor
register_entry.onchange = () => {
  if (register_entry.value)
    socket.send("/username" + register_entry.value);
    document.getElementById("chat").style.display = "block";
    document.getElementById("contenedor_usuario").style.display= "none";
  //-- Borrar el nombre de usario escrito actual
  register_entry.value = "";
}