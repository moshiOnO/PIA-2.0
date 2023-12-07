import { initializeFirebase } from "./connFB.js";
import { collection, Timestamp, query, where, getDocs, getDoc, doc, or, onSnapshot, orderBy, addDoc } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';


initializeFirebase().then(async ({ auth, db }) => {
    // Datos de HTML
    var ptsT = document.getElementById("pts");
    // Obtén el texto dentro del elemento
    var textoCompleto = ptsT.textContent;
    // Extrae solo el número del texto utilizando expresiones regulares
    var soloNumero = textoCompleto.match(/\d+/);
    // Convierte el resultado a un número
    var pts = soloNumero ? parseInt(soloNumero[0], 10) : null;
    //Nombre del usuario
    var name = document.getElementById("userPTS");
    //Botón
    var boton = document.getElementById("buttonPTS");
    console.log(boton);

    boton.addEventListener("click", async function () {
        console.log(name.value, pts);
        if (name.value && pts >= 0) {
            //Envía los puntajes del usuario
            await addDoc(collection(db, "usuarios"), {
                name: name.value,
                pts: pts, //autor                
            });
            //Y lo redirije a las puntuaciones
            window.location.href = `Puntuaciones.php`;                
        }

    });


});