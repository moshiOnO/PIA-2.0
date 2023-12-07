const tiempoLimiteSegundos = 5;
let tiempoRestante = tiempoLimiteSegundos;
let timerInterval;  // Mover la declaración aquí para que tenga un alcance más amplio

var timer = document.getElementById("timer");
timer.textContent = "Esperando Login";

// Inicia un temporizador que se ejecuta cada segundo
export function impTemp(temporizadorIniciado){

    timerInterval = setInterval(() => {
        if (temporizadorIniciado) {            
            tiempoRestante--;

            // Actualiza el contenido del elemento HTML con el tiempo restante
            timer.textContent = `Tiempo restante: ${tiempoRestante} segundos`;

            // Verifica si se ha agotado el tiempo
            if (tiempoRestante <= 0) {
                detenerTemporizador();
                var pts = parseInt(document.getElementById("pts").textContent);
                console.log(pts);                
                //Mandar a la base de datos los puntos obtenidos por las monedas * el tiempo restante
                window.location.href = `savepts.php?pts=${pts}`;
                console.log('Tiempo agotado. Fin del juego.');
            }
        }
    }, 1000);

}

// Función para detener el temporizador por 5 segundos
export function congelarTiempo() {
    console.log("CONGELAOOOOO");
    clearInterval(timerInterval);

    setTimeout(() => {
        // Después de 5 segundos, reanudar el temporizador
        console.log("NO CONGELAOOOO");
        impTemp(true);
    }, 5000);
}

// Función para detener el temporizador
function detenerTemporizador() {
    clearInterval(timerInterval);
}
