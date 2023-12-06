document.addEventListener("DOMContentLoaded", function() {
    // Obtiene el elemento del control deslizante
    var miSlider = document.getElementById("miSlider");

    // Verifica si hay un valor guardado en localStorage y establece el valor inicial
    var valorGuardado = localStorage.getItem("volumeMusic");
    miSlider.value = valorGuardado !== null ? valorGuardado : 0.8;

    // Configura el evento de cambio en el deslizador para guardar el valor en localStorage
    miSlider.addEventListener("input", function() {
        // Obtiene el valor del control deslizante
        var nuevoValor = miSlider.value;

        // Guarda el valor en localStorage
        localStorage.setItem("volumeMusic", nuevoValor);
    });
});