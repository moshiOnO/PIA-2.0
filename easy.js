import * as THREE from "./three.module.js";
import { OrbitControls } from "./OrbitControls.js";
import { impTemp, congelarTiempo, addptsHTML, sendptsWindow, detenerTemporizador } from "./javas/Temporizador.js"

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  onValue,
  set,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCD3jq-3G-6i6ECYAUa6gt0MYrLvco6R4I",
  authDomain: "pia-gcw-6945f.firebaseapp.com",
  databaseURL: "https://pia-gcw-6945f-default-rtdb.firebaseio.com",
  projectId: "pia-gcw-6945f",
  storageBucket: "pia-gcw-6945f.appspot.com",
  messagingSenderId: "594098419666",
  appId: "1:594098419666:web:0b1bb2cd7f8841a9f3fa0b",
  measurementId: "G-XPD4EB4FL4"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
auth.languageCode = "es";
const provider = new GoogleAuthProvider();
// Initialize Realtime Database and get a reference to the service
const db = getDatabase();
let currentUser;
async function login() {
  await signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      currentUser = result.user;
      //console.log(currentUser);
      var grados = 180;
      var angulo = THREE.MathUtils.degToRad(grados);
      writeUserData(currentUser.uid, 15, 15, angulo, 0);
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(error);
    });
}
const buttonLogin = document.getElementById("button-login");
const buttonLogout = document.getElementById("button-logout");
buttonLogin.addEventListener("click", async () => {
  await login();
});
buttonLogout.addEventListener("click", async () => {
  await signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log("Sign-out successful");
    })
    .catch((error) => {
      // An error happened.
      console.log("An error happened");
    });
});




//Cosas de THREE.js
import { GLTFLoader } from "./GLTFLoader.js";
//Necesario para animaciones
let clock = new THREE.Clock();
//Temporizador
let temporizadorIniciado = false;
var canvas = document.getElementById("canvas");
const scene = new THREE.Scene();
scene.background = new THREE.Color("#34495E");
const camera = new THREE.PerspectiveCamera(
  60,
  canvas.width / canvas.height
);
//Camera settings
camera.lookAt(0, 0, 0);
//Luces
var renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(canvas.width, canvas.height);
renderer.shadowMap.enabled = true;
const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(hemisphereLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 5, -1);
directionalLight.castShadow = true;
scene.add(directionalLight);

//******FUNCIONES PARA CASTEAR MODELOS AL ESCENARIO*********
//LoaderGLTF
const loaderGLTF = new GLTFLoader();
//Función para castear modelos sin collisions
function castModel(modelDIR, pX, pY, pZ) {
  // Cargar modelo
  loaderGLTF.load(modelDIR, (gltf) => {
    // Modelo cargado con éxito
    // Accede al objeto 3D del modelo
    const modelo = gltf.scene;
    // Ajusta la posición, escala, rotación según tus necesidades
    modelo.position.set(-5, -12.2, 0);
    modelo.scale.set(1, 1, 1);
    // Rotar 90 grados alrededor del eje Y
    modelo.rotation.set(0, Math.PI / 2, 0);
    // Asegúrate de que el modelo pueda recibir sombras si es necesario
    modelo.receiveShadow = true;
    // Añade el modelo a la escena
    scene.add(modelo);
  });

}
//Función para castear PJ con su colisión propia
let clipAction;
let modelGLTF4ext;
async function castPJ(direction, namemesh, meshID, action) {
  const MONSTERGLTF = new GLTFLoader();
  let monsterMixer;
  MONSTERGLTF.load(direction, function (modelGLTF4) {
    const namemesh = modelGLTF4.scene;
    namemesh.scale.set(1, 1, 1);
    namemesh.position.set(15, -0.5, 15);

    var grados = 180;
    var angulo = THREE.MathUtils.degToRad(grados);
    //var angulo = Math.PI / 4; // el ángulo de rotación en radianes

    //namemesh.rotateX(angulo);
    namemesh.rotateY(angulo);
    //namemesh.rotateZ(angulo);
    namemesh.name = meshID;
    //Carga de colisión
    let col = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    //col.setFromObject(namemesh);
    //console.log(col);

    scene.add(namemesh);
    if (modelGLTF4.animations && modelGLTF4.animations.length > 0) {
      monsterMixer = new THREE.AnimationMixer(namemesh);
      //0, 1, 2, 3
      //Programar número de animación por reproducir (idle,bomb,run, dead)
      clipAction = monsterMixer.clipAction(modelGLTF4.animations[action]);
      clipAction.play();
    }

    namemesh.userData.mixer = monsterMixer;
    namemesh.userData.action = clipAction;
    modelGLTF4ext = modelGLTF4;


    function animate() {

      col.setFromObject(namemesh);
      namemesh.userData.boundingBox = col;
      //console.log(col);


      if (monsterMixer) {
        monsterMixer.update(0.01);
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

  });

}
// 0:Idle,  1:Explotar bomba,  2:Caminar,  3:Se acabó el tiempo
//castPJ("./bomberman.glb", "monsterModel", "meshID", 0);
//Función para castear modelos con colisión cuadrada
async function castObjSquare(dirMesh, pX, pY, pz, nameMesh, scale) {
  loaderGLTF.load(
    dirMesh,
    function (modelGLTF) {
      //Carga de mesh
      const obj = modelGLTF.scene;
      obj.scale.set(scale, scale, scale);
      obj.position.set(pX, pY, pz);
      obj.castShadow = true;
      obj.receiveShadow = true;
      obj.name = nameMesh;
      //console.log(obj.name);
      //Carga de colisión
      let col = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
      col.setFromObject(obj);
      //console.log(col); 
      // Haciendo col accesible externamente
      obj.userData.boundingBox = col;
      //console.log(obj.userData.boundingBox);

      scene.add(obj);
    }
  );

}

//*************FUNCIONES PARA GENERACIÓN RANDOM DE NÚMEROS***************
//Función para generar un número aleatorio entre 1 y 3
function RandNum() {
  return Math.floor(Math.random() * 3) + 1;
}
//Función para generar números aleatorios con un rango
function RandNumR(minimo, maximo) {
  return Math.random() * (maximo - minimo) + minimo;
}





//**************Generación de modelos para el escenario*************
let scenarioNum = RandNum();
let limX, limZ;
//Selección del escenario
switch (2) {
  case 1:
    castModel("./TV.glb", -5, -12.2, 0); //Cast TV Scenario
    camera.position.set(0, 45, -30);
    //Limites x "40, -40"
    limX = [40, -40];
    //Limites z "35,-15"
    limZ = [35, -15];
    break;

  case 2:
    castModel("./CAMP.glb", -5, -12.2, 0); //Cast CAMP Scenario
    camera.position.set(0, 35, -30);
    //Limites x "32, -32"
    limX = [32, -32];
    //Limites z "38,-14"
    limZ = [38, -14];
    break;

  case 3:
    castModel("./FABRIC.glb", -5, -12.2, 0); //Cast FABRIC Scenario
    camera.position.set(0, 55, -36);
    //Limites x "30, -30"
    limX = [30, -30];
    //Limites z "40,-20"
    limZ = [40, -20];
    break;

  default:
    break;
}

// COLISIONES DE POWERUPS
//castObjSquare("./zapatos.glb", 5, .5, 4, "speed", 1);
//castObjSquare("./ice.glb", 3, -.5, 4, "freeze", 3);
for (let index = 0; index < 2; index++) {
  castObjSquare("./ice.glb", RandNumR(limX[1], limX[0]), -.5, RandNumR(limZ[1], limZ[0]), "freeze" + index, 3);
  castObjSquare("./zapatos.glb", RandNumR(limX[1], limX[0]), -.5, RandNumR(limZ[1], limZ[0]), "speed" + index, 1);
  castObjSquare("./star.glb", RandNumR(limX[1], limX[0]), 1, RandNumR(limZ[1], limZ[0]), "star" + index, 1.5);
}

//Generaciones de las cajas con las monedas adentro
//Primero generamos los modelos de las cajas con monedas aleatoramiente
//Monedas (Siempre serán solo 6 monedas por escenario)
let xrandC, zrandC;
for (let index = 0; index < 6; index++) {
  xrandC = RandNumR(limX[1], limX[0]); zrandC = RandNumR(limZ[1], limZ[0]);
  castObjSquare("./box.glb", xrandC, 1, zrandC, "box" + index, 2);
  castObjSquare("./coin.glb", xrandC, -.5, zrandC, "coin" + index, .25);
}
//Ahora generamos las demás cajas sin moneda adentro
//easy: 2, normal: 6, hard: 12
for (let index = 0; index < 2; index++) {
  xrandC = RandNumR(limX[1], limX[0]); zrandC = RandNumR(limZ[1], limZ[0]);
  castObjSquare("./box.glb", xrandC, 1, zrandC, "boxNC" + index, 2);
}








//******ONLINE AND INPUTS***********
const starCountRef = ref(db, "jugadores");
onValue(starCountRef, (snapshot) => {
  const data = snapshot.val();

  Object.entries(data).forEach(([key, value]) => {
    //console.log(`${key} ${value.x} ${value.z}`);

    const jugador = scene.getObjectByName(key);
    if (!jugador) {
      // const geometry = new THREE.BoxGeometry(1, 1, 1);
      // const material = new THREE.MeshPhongMaterial();
      // const mesh = new THREE.Mesh(geometry, material);
      // mesh.castShadow = true;
      // mesh.position.set(value.x, 0, value.z);
      // mesh.material.color = new THREE.Color(Math.random() * 0xffffff);
      // mesh.name = key;
      //monsterModel.name = key;
      //scene.add(mesh);
      castPJ("./altair.glb", "monsterModel", key, 0);
    }

    scene.getObjectByName(key).position.x = value.x;
    scene.getObjectByName(key).position.z = value.z;
    scene.getObjectByName(key).rotation.set(0, value.rotation, 0);
    cambiarAccionOnline(value.a, key);
  });
});
//Escribir
function writeUserData(userId, positionX, positionZ, rotation, animation) {
  set(ref(db, "jugadores/" + userId), {
    x: positionX,
    z: positionZ,
    a: animation,
    rotation: rotation,
  });
}
function resize() {
  camera.aspect = canvas.innerWidth / canvas.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.innerWidth, canvas.innerHeight);
  renderer.render(scene, camera);
}
canvas.addEventListener("resize", resize);




var velocidad = 0.25; // Velocidad inicial del jugador
document.addEventListener('keydown', function (e) {
  const jugadorActual = scene.getObjectByName(currentUser.uid);
  // Limitar la posición en x entre -40 y 40
  //Limites x "40, -40"
  //Limites z "35,-15"
  jugadorActual.position.x = Math.max(limX[1], Math.min(limX[0], jugadorActual.position.x));
  jugadorActual.position.z = Math.max(limZ[1], Math.min(limZ[0], jugadorActual.position.z));

  let rotationgrado;
  switch (e.key) {
    case 'ArrowRight':
      jugadorActual.position.x -= velocidad;
      var gradosDerecha = 270;
      var anguloDerecha = THREE.MathUtils.degToRad(gradosDerecha);
      rotationgrado = anguloDerecha;
      jugadorActual.rotation.set(0, anguloDerecha, 0);
      cambiarAccionExterna(2);
      break;

    case 'ArrowLeft':
      jugadorActual.position.x += velocidad;
      var gradosDerecha = 90;
      var anguloDerecha = THREE.MathUtils.degToRad(gradosDerecha);
      rotationgrado = anguloDerecha;
      jugadorActual.rotation.set(0, anguloDerecha, 0);
      cambiarAccionExterna(2);
      break;

    case 'ArrowDown':
      jugadorActual.position.z -= velocidad;
      var gradosDerecha = 180;
      var anguloDerecha = THREE.MathUtils.degToRad(gradosDerecha);
      rotationgrado = anguloDerecha;
      jugadorActual.rotation.set(0, anguloDerecha, 0);
      cambiarAccionExterna(2);
      break;

    case 'ArrowUp':
      jugadorActual.position.z += velocidad;
      var gradosDerecha = 0;
      var anguloDerecha = THREE.MathUtils.degToRad(gradosDerecha);
      rotationgrado = anguloDerecha;
      jugadorActual.rotation.set(0, anguloDerecha, 0);
      cambiarAccionExterna(2);
      break;

    case 'e':
      generateBomb();

      break;


    default:
      // Otras teclas, si es necesario
      break;
  }

  if (!temporizadorIniciado) {
    impTemp(true);
    temporizadorIniciado = true;
  }

  writeUserData(
    currentUser.uid,
    jugadorActual.position.x,
    jugadorActual.position.z,
    jugadorActual.rotation.y,
    2
  );

  checkCollision(1); checkCollision(2); checkCollision(3);
  checkCollisionC(); checkCollisionB(); checkCollisionBNC()
  checkPTS();
  //checkCollisions();
  //checkPlayerBoxCollisions();

});

document.addEventListener('keyup', (event) => {
  cambiarAccionExterna(0);
  //cambio Online
  const jugadorActual = scene.getObjectByName(currentUser.uid);
  writeUserData(
    currentUser.uid,
    jugadorActual.position.x,
    jugadorActual.position.z,
    jugadorActual.rotation.y,
    0
  );
});


//*************JUGABILIDAD*****************
//Monedas coleccionadas
let coinsCollected = 0;
let points = 0; let isMultiply = false;
//Bools para verificar que la caja de la moneda está rota, para poder coleccionarla
let box = [false, false, false, false, false, false];

//Checar colisiones con powerups
function checkCollision(powerup) {
  const powerNames = {
    1: "speed",
    2: "freeze",
    3: "star"
  };

  const jugadorActual = scene.getObjectByName(currentUser.uid);
  const powerupNameBase = powerNames[powerup];
  let powerupName, playerBB, powerupMesh;
  for (let index = 0; index < 2; index++) {

    playerBB = jugadorActual.userData.boundingBox;
    powerupMesh = scene.getObjectByName(powerupNameBase + index);
    //console.log(powerupNameBase + index);

    if (playerBB && powerupMesh) {
      const powerupBB = powerupMesh.userData.boundingBox;

      // Comprueba la intersección
      if (playerBB.intersectsBox(powerupBB)) {
        console.log("¡Colisión detectada!");

        // Dependiendo del powerUp, se ejecutará una función distinta
        switch (powerup) {
          case 1:
            SpeedUp();
            soundEffect(powerNames[powerup]);
            break;
          case 2:
            congelarTiempo();
            soundEffect(powerNames[powerup]);
            break;
          case 3:
            MultiplyPTS();
            soundEffect(powerNames[powerup]);
            break;
          default:
            break;
        }

        eliminarModelo(powerupMesh);
      }
    }

  }
}
//Funciónes de activación de powerups
function SpeedUp() {
  // Aumentar temporalmente la velocidad
  velocidad *= 2; // Puedes ajustar este valor según lo que encuentres equilibrado
  console.log(velocidad);

  // Después de 5 segundos, restablecer la velocidad a su valor original
  setTimeout(function () {
    velocidad /= 2;
  }, 5000); // 5000 milisegundos = 5 segundos
}
function MultiplyPTS() {
  console.log("PUNTOS MULTIPLICADOOOOOS");
  isMultiply = true;
  setTimeout(() => {
    // Después de 5 segundos, reanudar el temporizador
    console.log("JA, POBREEEEE");
    soundEffect("endstar");
    isMultiply = false;
  }, 20000);
}
//Función de generación de bombas
function generateBomb() {
  const j = scene.getObjectByName(currentUser.uid);
  let bombMesh = scene.getObjectByName("bomb");
  if (bombMesh) {
    let col = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    col.setFromObject(bombMesh);
    //console.log(col); 
    // Haciendo col accesible externamente
    bombMesh.userData.boundingBox = col;
    bombMesh.position.x = j.position.x;
    bombMesh.position.z = j.position.z;
  }
  else {
    castObjSquare("./bomb.glb", j.position.x, j.position.y, j.position.z, "bomb", 1);
  }
}
//Checar colisiones con monedas
function checkCollisionC() {
  const jugadorActual = scene.getObjectByName(currentUser.uid);
  const powerupNameBase = "coin";
  let playerBB, powerupMesh;
  //Siempre son 6 monedas
  for (let index = 0; index < 6; index++) {

    playerBB = jugadorActual.userData.boundingBox;
    powerupMesh = scene.getObjectByName(powerupNameBase + index);
    //console.log(powerupNameBase + index);

    if (playerBB && powerupMesh && box[index]) {
      const powerupBB = powerupMesh.userData.boundingBox;

      // Comprueba la intersección
      if (playerBB.intersectsBox(powerupBB)) {
        console.log("¡Colisión detectada!");
        //easy: 100, normal: 200, hard: 300
        if(isMultiply === false) {points += 100;}
        else{points += 100*2}
        coinsCollected += 1;
        //addptsHTML(coinsCollected);
        addptsHTML(points);
        console.log(coinsCollected);
        soundEffect("coin");
        eliminarModelo(powerupMesh);
      }
    }

  }
}
//Checar colisiones con cajas
function checkCollisionB() {

  const jugadorActual = scene.getObjectByName("bomb");
  const powerupNameBase = "box";
  let playerBB, powerupMesh;
  //Siempre son 6 monedas
  if (jugadorActual.userData.boundingBox) {
    for (let index = 0; index < 6; index++) {

      playerBB = jugadorActual.userData.boundingBox;
      powerupMesh = scene.getObjectByName(powerupNameBase + index);
      //console.log(powerupNameBase + index);

      if (playerBB && powerupMesh) {
        const powerupBB = powerupMesh.userData.boundingBox;

        // Comprueba la intersección
        if (playerBB.intersectsBox(powerupBB)) {
          console.log("¡Colisión detectada!");
          box[index] = true;
          soundEffect("explosion");
          eliminarModelo(powerupMesh);
        }
      }

    }
  }
}
function checkCollisionBNC() {

  const jugadorActual = scene.getObjectByName("bomb");
  const powerupNameBase = "boxNC";
  let playerBB, powerupMesh;
  //easy: 2, normal: 6, hard: 12
  if (jugadorActual.userData.boundingBox) {
    for (let index = 0; index < 2; index++) {

      playerBB = jugadorActual.userData.boundingBox;
      powerupMesh = scene.getObjectByName(powerupNameBase + index);
      //console.log(powerupNameBase + index);

      if (playerBB && powerupMesh) {
        const powerupBB = powerupMesh.userData.boundingBox;

        // Comprueba la intersección
        if (playerBB.intersectsBox(powerupBB)) {
          console.log("¡Colisión detectada!");
          soundEffect("explosion");
          eliminarModelo(powerupMesh);
        }
      }

    }
  }
}
//Checar si todas las monedas fueron recolectadas
function checkPTS() {
  //easy: 600, normal:  1200, hard: 1800
  if (coinsCollected >= 6) {
    //Ponemos el modelo del jugador fuera del campo de visión
    var grados = 180;
    var angulo = THREE.MathUtils.degToRad(grados);
    writeUserData(currentUser.uid, 150, 0, angulo, 0); 
    sendptsWindow();
  }
}
//Pausa
document.addEventListener('DOMContentLoaded', function () {
  // Tu código existente aquí...
  // Agrega la función pause directamente al botón
  document.querySelector('button[data-action="pause"]').onclick = function () {
      const jugadorActual = scene.getObjectByName(currentUser.uid);
      if (jugadorActual.userData.action) {
          jugadorActual.userData.action.stop();
          temporizadorIniciado = false;
          detenerTemporizador();
      }
  };
});
//Eliminación de modelos
function eliminarModelo(modelo) {
  // Elimina el modelo de la escena
  scene.remove(modelo);

  // Limpia la memoria si es necesario
  // (libera texturas, geometrías, etc.)
  //liberarRecursos(modelo);

  // Actualiza la escena para reflejar los cambios
  renderer.render(scene, camera);
}
//Cambiar animación
function cambiarAccionExterna(nuevaAccion) {
  const jugadorActual = scene.getObjectByName(currentUser.uid);

  if (jugadorActual.userData.action) {
    let currentTime = jugadorActual.userData.action.time;
    jugadorActual.userData.action.stop(); // Detener la acción actual si es necesario
    jugadorActual.userData.action = jugadorActual.userData.mixer.clipAction(modelGLTF4ext.animations[nuevaAccion]);
    jugadorActual.userData.action.time = currentTime;
    jugadorActual.userData.action.play();
  }
}
//Cambiar animación online
function cambiarAccionOnline(nuevaAccion, id) {
  const jugadorActual = scene.getObjectByName(id);

  if (jugadorActual.userData.action) {
    let currentTime = jugadorActual.userData.action.time;
    jugadorActual.userData.action.stop(); // Detener la acción actual si es necesario
    jugadorActual.userData.action = jugadorActual.userData.mixer.clipAction(modelGLTF4ext.animations[nuevaAccion]);
    jugadorActual.userData.action.time = currentTime;
    jugadorActual.userData.action.play();
  }
}
//Reproduce sonidos
//obtiene el audio del html por su id
function soundEffect(sound) {
  var audio = document.getElementById(sound);

  //Pone el volumen del localStorage
  function actualizarVolumenDesdeLocalStorage() {
      var nuevoVolumen = localStorage.getItem("volumeMusic");
      if (nuevoVolumen !== null) {
          audio.volume = parseFloat(nuevoVolumen);
          // Disparar un evento personalizado para notificar el cambio de volumen interno
          var eventoCambioVolumenInterno = new CustomEvent("cambioVolumenInterno", { detail: { nuevoVolumen: nuevoVolumen } });
          document.dispatchEvent(eventoCambioVolumenInterno);
      }
  }
  // Llama a la función al cargar la página
  actualizarVolumenDesdeLocalStorage();
  //Después reproducimos el sonido
  audio.play(); 
}

const cameraControl = new OrbitControls(camera, renderer.domElement);