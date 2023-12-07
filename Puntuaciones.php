<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Puntuaciones</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css">
    <link rel="stylesheet" href="Puntuaciones.css">
</head>
<body>
    <audio id="miAudio" controls autoplay>
        <source src="music/points.mp3" type="audio/mp3">
        Tu navegador no soporta el elemento de audio.
    </audio>

    <div class="container">
        <div class="info-box">
            <h1>Puntuaciones</h1>
            <hr>
            <div id="usuariosPTS">
            <!-- <p>Jugador 1 ........ 450</p>
            <p>Jugador 2 ........ 350</p>
            <p>Jugador 3 ........ 250</p>
            <p>Jugador 4 ........ 150</p>
            <p>Jugador 5 ........ 50</p> -->
            </div>            
            <hr>
            <a href="Inicio.php">Continuar</a>
            <br>
            <a href="Inicio.php">Salir</a>
        </div>
    </div>
    
    <script src="javas/getVolume.js" type="module"></script>
    <script src="javas/getPTS.js" type="module"></script>
</body>
</html>