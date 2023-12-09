<?php
// Obtener el valor del parámetro 'diff' de la URL
$dificultad = isset($_GET['diff']) ? $_GET['diff'] : 'easy';

// Imprimir el valor para verificar
// echo 'Dificultad seleccionada: ' . $dificultad;

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <!-- <script type= "module" src="easy.js"></script> -->
    <script src="<?php echo $dificultad; ?>.js" type="module"></script>
    <script type= "module" src="javas/Temporizador.js"></script>
    <!-- API -->
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="capturarPantalla.js"></script>
    <title>Nombre del Juego</title>
</head>
<body>
       <audio id="miAudio" controls autoplay>
         <source src="music/<?php echo $dificultad; ?>.mp3" type="audio/mp3">
         Tu navegador no soporta el elemento de audio.
       </audio>

       <div>
       <audio id="coin" controls>
         <source src="sounds/coin.mp3" type="audio/mp3">
         Tu navegador no soporta el elemento de audio.
       </audio>
       <audio id="endstar" controls>
         <source src="sounds/endstar.mp3" type="audio/mp3">
         Tu navegador no soporta el elemento de audio.
       </audio>
       <audio id="explosion" controls>
         <source src="sounds/explosion.mp3" type="audio/mp3">
         Tu navegador no soporta el elemento de audio.
       </audio>
       <audio id="freeze" controls>
         <source src="sounds/freeze.mp3" type="audio/mp3">
         Tu navegador no soporta el elemento de audio.
       </audio>
       <audio id="speed" controls>
         <source src="sounds/speed.mp3" type="audio/mp3">
         Tu navegador no soporta el elemento de audio.
       </audio>
       <audio id="star" controls>
         <source src="sounds/star.mp3" type="audio/mp3">
         Tu navegador no soporta el elemento de audio.
       </audio>
       </div>

    <div class="container">
        <h1 id="timer">Nombre del Juego</h1>
        <hr>
        <div class="game-box">
                <button id="button-login">Login</button>
                <button id="button-logout">Logout</button>
                <button onclick="capturarPantalla()">Captura</button>
            <canvas id = "canvas" width = "700" height = "450">
                
            </canvas>
            <!-- Aquí puedes agregar el contenido de tu juego -->
            <!--<img src="assets/game.jpg">-->
        </div>
        <div class="button-container">
            <!-- <a href="Pausa.php?diff=<?php echo $dificultad;?>">Pausa</a> -->
            <button data-action="pause">Pausa</button>
            <a href="Inicio.php">Inicio</a>
            <a href="Inicio.php">Salir</a>
        </div>
    </div>

    <p id="pts">0</p>
    
    <script src="javas/getVolume.js" type="module"></script>
</body>
</html>