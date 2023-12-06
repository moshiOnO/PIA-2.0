document.addEventListener("DOMContentLoaded", function () {
    var audio = document.getElementById("miAudio");
    var volumenInput = document.getElementById("miSlider");

    function actualizarVolumenDesdeLocalStorage() {
        var nuevoVolumen = localStorage.getItem("volumeMusic");
        if (nuevoVolumen !== null) {
            audio.volume = parseFloat(nuevoVolumen);
            // Disparar un evento personalizado para notificar el cambio de volumen interno
            var eventoCambioVolumenInterno = new CustomEvent("cambioVolumenInterno", { detail: { nuevoVolumen: nuevoVolumen } });
            document.dispatchEvent(eventoCambioVolumenInterno);
        }
    }

    // Llama a la función al cargar la página
    actualizarVolumenDesdeLocalStorage();

    // Configura un evento que escuche cambios en el almacenamiento local
    window.addEventListener("storage", function (event) {
        if (event.key === "volumeMusic") {
            actualizarVolumenDesdeLocalStorage();
        }
    });

    //Si se hace desde la ventana de settings..
    if (volumenInput) {
        // Configura un evento personalizado para escuchar cambios de volumen internos
        document.addEventListener("cambioVolumenInterno", function (event) {
            var nuevoVolumen = event.detail.nuevoVolumen;
            // Realiza acciones adicionales en respuesta al cambio de volumen interno
            audio.volume = parseFloat(nuevoVolumen);
            console.log("Volumen cambiado internamente: " + nuevoVolumen);
        });

        // Configura un escuchador de eventos en el input para capturar cambios locales
        volumenInput.addEventListener("input", function () {
            // Actualiza el valor en localStorage y dispara el evento personalizado
            localStorage.setItem("volumeMusic", volumenInput.value);
            var eventoCambioVolumenInterno = new CustomEvent("cambioVolumenInterno", { detail: { nuevoVolumen: volumenInput.value } });
            document.dispatchEvent(eventoCambioVolumenInterno);
        });
    }



    // Ejemplo de cómo cambiar el volumen internamente
    // Simplemente cambia el valor del input cuando desees cambiar el volumen internamente
    // Puedes hacerlo en respuesta a eventos específicos de tu aplicación.
    // volumenInput.value = nuevoValor;  // Coloca el nuevo valor
    // volumenInput.dispatchEvent(new Event("input"));  // Dispara el evento input para reflejar el cambio
});
