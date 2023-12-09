<?php
// Obtener el valor del parámetro 'diff' de la URL
$dificultad = isset($_GET['diff']) ? $_GET['diff'] : 'easy';

// Imprimir el valor para verificar
// echo 'Dificultad seleccionada: ' . $dificultad;

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pausa</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css">
    <link rel="stylesheet" href="Pausa.css">
</head>
<body>
        <div class="container">
            <div class="info-box">
                <h1>Pausa</h1>
                <hr>
                <a href="paginajuegos.php?diff=<?php echo $dificultad;?>">Continuar</a>
                <br>
                <a href="Inicio.php">Salir</a>
            </div>
        </div>
</body>
</html>