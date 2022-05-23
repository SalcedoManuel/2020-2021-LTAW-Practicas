//-- Elementos del interfaz
const display = document.getElementById("display");
const register_entry = document.getElementById("register_entry");

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
register_entry.onchange = () => {
  if (register_entry.value)
    socket.send(register_entry.value);
  
  //-- Borrar el nombre de usario escrito actual
  register_entry.value = "";
}

