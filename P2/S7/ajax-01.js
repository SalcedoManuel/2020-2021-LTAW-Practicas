const m = new XMLHttpRequest();
m.onreadystatechange = () => {

  //-- Hay un cambio de estado en la peticion
  //-- Típicamente sólo estremos interesados en lo que ha ocurrido
  //-- cuando se complete
  if (m.readyState==4) {
    //-- Peticion completada
    //...procesar la respuesta
  }
}
//-- Configurar la petición
m.open("GET", "/recurso", true);

//-- Enviar la peticion
m.send();
//-- Funcion de retrollamada de la peticion
m.onreadystatechange = () => {

  //-- Peticion completa
  if (m.readyState==4) {

    //-- El mensaje recibido es ok
    if (m.status == 200) {
      //-- Procesar la respuesta
      //-- que se encuentra en m.responseText
      //-- ....
     }
  }
}
