const tiempoLimiteSegundos = 60;
let tiempoRestante = tiempoLimiteSegundos;

var timer = document.getElementById("timer");
console.log(timer);
timer.textContent = "xD";

// Inicia un temporizador que se ejecuta cada segundo
export function impTemp(temporizadorIniciado){

const timerInterval = setInterval(() => {
    if (temporizadorIniciado) {
        tiempoRestante--;

        // Actualiza el contenido del elemento HTML con el tiempo restante
        timer.textContent = `Tiempo restante: ${tiempoRestante} segundos`;

        // Verifica si se ha agotado el tiempo
        if (tiempoRestante <= 0) {
            detenerTemporizador();
            console.log('Tiempo agotado. Fin del juego.');
        }
    }
}, 1000);

}

// Función para detener el temporizador
function detenerTemporizador() {
    clearInterval(timerInterval);
}

