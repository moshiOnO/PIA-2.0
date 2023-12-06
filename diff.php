<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Titulo del juego</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css">
    <link rel="stylesheet" href="diff.css">
</head>
<body>
       <audio id="miAudio" controls autoplay>
         <source src="music/diffs.mp3" type="audio/mp3">
         Tu navegador no soporta el elemento de audio.
       </audio>

    <div class="container">

        <div class="boxxie">
            <h1>Dificultad del juego</h1>
            <hr>
            <div class="configs">

                <!-- <p>Inicia Sesión</p>
                <button id="button-login">Login</button>
                
                <br> <br>      -->

                <!-- <p>Dificultad</p> -->
                <div class="diffs">

                    <div class="easy">
                        <a href="paginajuegos.php?diff=easy">Fácil</a>                        
                    </div>

                    <div class="normal">
                        <a href="paginajuegos.php?diff=normal">Normal</a>
                    </div>

                    <div class="hard">
                        <a href="paginajuegos.php?diff=hard">Difícil</a>
                    </div>  

                </div>
                
            </div>            
            <br>
            
            <div class="links">
                <a href="Inicio.php">Volver al inicio</a>                
                <a href="Inicio.php">Salir</a>
            </div>

        </div>
     
    </div>

    <script src="javas/getVolume.js" type="module"></script>
</body>
</html>