<?php
// Obtener el valor del parámetro 'diff' de la URL
$dificultad = isset($_GET['diff']) ? $_GET['diff'] : 'facil';

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
    <title>Nombre del Juego</title>
</head>
<body>
       <audio id="miAudio" controls autoplay>
         <source src="music/<?php echo $dificultad; ?>.mp3" type="audio/mp3">
         Tu navegador no soporta el elemento de audio.
       </audio>

    <div class="container">
        <h1 id="timer">Nombre del Juego</h1>
        <hr>
        <div class="game-box">
                <button id="button-login">Login</button>
                <button id="button-logout">Logout</button>
            <canvas id = "canvas" width = "700" height = "450">
                
            </canvas>
            <!-- Aquí puedes agregar el contenido de tu juego -->
            <!--<img src="assets/game.jpg">-->
        </div>
        <div class="button-container">
            <a href="Pausa.php">Pausa</a>
            <a href="Inicio.php">Inicio</a>
            <a href="Inicio.php">Salir</a>
        </div>
    </div>
    
    <script src="javas/getVolume.js" type="module"></script>
</body>
</html>