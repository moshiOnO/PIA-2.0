function capturarPantalla() {
    console.log("La función capturarPantalla() se ha ejecutado");
    // Captura la pantalla
    const screenshot = document.createElement("canvas");
    screenshot.width = window.innerWidth;
    screenshot.height = window.innerHeight;
    screenshot.getContext("2d").drawImage(document.body, 0, 0);
  
    // Obtiene la imagen de la captura
    const dataURL = screenshot.toDataURL();
  
    // Muestra el cuadro de diálogo para elegir la red social
    const opciones = ["Facebook", "Instagram"];
    const opcionElegida = window.prompt("Elige una red social:", opciones);
  
    // Subir la captura a la red social elegida
    if (opcionElegida === "Facebook") {
      const formData = new FormData();
      formData.append("url", dataURL);
      formData.append("album", "Mis capturas de pantalla");
  
      axios.post("https://graph.facebook.com/v12.0/me/photos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then(() => {
          console.log("Captura subida a Facebook");
        })
        .catch(error => {
          console.error(error);
        });
    } else if (opcionElegida === "Instagram") {
      // TODO: Implementar la subida a Instagram (requiere autenticación)
    }
  }
  