<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <script type= "module" src="Visualizacion.js"></script>
    <script type= "module" src="javas/Temporizador.js"></script>
    <title>Nombre del Juego</title>
</head>
<body>
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
</body>
</html>