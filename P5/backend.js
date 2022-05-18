console.log("Ejecutando Javascript...");

//-- Elementos HTML para mostrar informacion
const display1 = document.getElementById("display1");
const display2 = document.getElementById("display2");
const display3 = document.getElementById("display3");

//-- Caja de busqueda
const caja = document.getElementById("caja");

let productos = ["Cubo2x2","Cubo3x3","Cubo4x4","Cubo Atleti","Megamix"];

//-- Retrollamda del boton de Ver productos
caja.oninput = () => {
    if(caja.value.length >= 1){
        console.log("Buscando...");
        display1.innerHTML = "";

        for (let i=0; i < productos.length; i++){
            console.log(caja.value);
            let coincidencia = productos[i].split(caja.value);
            console.log(coincidencia)
            if (coincidencia.length > 1) {
                if (display1.innerHTML == "") {
                    display1.innerHTML += productos[i];
                    display1.style.display = '';
                }else if (display2.innerHTML == "") {
                    display2.innerHTML += productos[i];
                    display2.style.display = '';
                } else if(display3.innerHTML == ""){
                    display3.innerHTML += productos[i];
                    display3.style.display = '';
                }
            }else if(coincidencia.length == 1){
                if (display2.innerHTML == coincidencia[0]) {
                    display2.innerHTML = "1";
                    display2.style.display = 'none';
                }
                if (display3.innerHTML == coincidencia[0]) {
                    display3.innerHTML = "";
                    display3.style.display ='none'
                }
            }
        }

    }else{
        display1.innerHTML = "";
        display2.innerHTML = "";
        display3.innerHTML = "";
        num = 0;
    }
    if (display1.innerHTML == "") {
        display1.style.display = 'none';
        display2.style.display = 'none';
        display3.style.display = 'none';
    }
}


display1.oninput = () => {
    console.log("Enviar a la opción marcada, hacer luego con AJAX");

}