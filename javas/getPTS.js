import { initializeFirebase } from "./connFB.js";
import { collection, Timestamp, query, where, getDocs, getDoc, doc, or, onSnapshot, orderBy, addDoc } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';


initializeFirebase().then(async ({ db }) => {
    try {
        // Referencia a la colección y consulta ordenada por pts en orden descendente
        const miColeccion = collection(db, 'usuarios');
        const miConsulta = query(miColeccion, orderBy('pts', 'desc'));

        // Obtén los documentos ordenados por pts
        const querySnapshot = await getDocs(miConsulta);

        // Obtén el elemento HTML donde mostrarás la información
        const usuariosPTS = document.getElementById('usuariosPTS');

        // Limpiar el contenido actual del elemento
        usuariosPTS.innerHTML = '';

        // Itera sobre los documentos
        querySnapshot.forEach((doc) => {
            // Accede a los datos de cada documento
            const data = doc.data();

            // Crea un párrafo con la información del usuario y agrega al elemento
            const parrafo = document.createElement('p');
            parrafo.textContent = `${data.name} ........ ${data.pts}`;
            usuariosPTS.appendChild(parrafo);
        });
    } catch (error) {
        console.error('Error al obtener documentos:', error);
    }
});