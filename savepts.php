<?php
// Obtener el valor del parámetro 'diff' de la URL
$points = isset($_GET['pts']) ? $_GET['pts'] : 0;

// Imprimir el valor para verificar
// echo 'Dificultad seleccionada: ' . $dificultad;

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Titulo del juego</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css">
    <link rel="stylesheet" href="config.css">
    
</head>
<body>

    <audio id="miAudio" controls autoplay>
        <source src="music/name.mp3" type="audio/mp3">
        Tu navegador no soporta el elemento de audio.
    </audio>

    <div class="container">

        <div class="boxxie">
            <h1>FIN DEL JUEGO</h1>
            <hr>
            <div class="configs">
                            
                <p>Ingrese el nombre para guardar el puntaje:</p>
                
                <p id="pts">PUNTOS: <?php echo $points; ?></p>
                <input type="text" id="userPTS">
                <!-- <p>Volumen de sonidos</p>
                <input type="range" min="1" max="100" value="50" class="drag__bar">  -->
                
            </div>            
            
            <div class="links">                
                <input id="buttonPTS" class="butts" type="button" value="Guardar Puntaje">            
            </div>

        </div>
     
    </div>
   
    <script src="javas/getVolume.js" type="module"></script>
    <script src="javas/updatePTS.js" type="module"></script>
</body>
</html>