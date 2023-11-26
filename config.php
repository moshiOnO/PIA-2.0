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
    <div class="container">

        <div class="boxxie">
            <h1>Configuración</h1>
            <hr>
            <div class="configs">
                            
                <p>Volumen de música</p>
                <input type="range" min="1" max="100" value="50" class="drag__bar">
                <p>Volumen de sonidos</p>
                <input type="range" min="1" max="100" value="50" class="drag__bar"> 
                
            </div>            
            
            <div class="links">
                <a href="Inicio.php">Volver al inicio</a>
                <input class="butts" type="button" value="Reconfigurar valores">
                <br>
                <a href="Inicio.php">Salir</a>
            </div>

        </div>
     
    </div>
</body>
</html>