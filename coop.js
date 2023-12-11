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
  FacebookAuthProvider
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  onValue,
  set,
  remove,
  get
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
//Luces
const hemisphereLight = new THREE.HemisphereLight(0xffaabb, 0x8a2be2, .8);
scene.add(hemisphereLight);
// Configuración de la iluminación ambiental
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // color, intensidad
scene.add(ambientLight);
//Iluminación focal
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
    console.log(namemesh.name);
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
      console.log(obj.name);
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
switch (1) {
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




//******ONLINE AND INPUTS***********
let arrayUsers = [];
const starCountRef = ref(db, "coop");
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
      //console.log(key);
      arrayUsers.push(key);
      castPJ("./altair.glb", "monsterModel", key, 0);
    }

    //console.log("cambio Online", value.rotation);
    scene.getObjectByName(key).position.x = value.x;
    scene.getObjectByName(key).position.z = value.z;
    scene.getObjectByName(key).rotation.set(0, value.rotation, 0);
    cambiarAccionOnline(value.a, key);
  });
});
//Escribir
function writeUserData(userId, positionX, positionZ, rotation, animation) {
  set(ref(db, "coop/" + userId), {
    x: positionX,
    z: positionZ,
    a: animation,
    rotation: rotation,
    v: true
  });
}
function deleteUserData(userId) {
  //console.log(userId);
  const eliminado = scene.getObjectByName(userId);
  remove(ref(db, "coop/" + userId));
  eliminarModelo(eliminado);
}
//Bomba
const bombCountRef = ref(db, "bomb");
onValue(bombCountRef, (snapshot) => {
  const data = snapshot.val();

  Object.entries(data).forEach(([key, value]) => {
    //console.log(`${key} ${value.x} ${value.z}`);

    console.log(key);
    const bomb = scene.getObjectByName(key);
    if (!bomb) {
      const j = scene.getObjectByName(currentUser.uid);
      console.log(key);
      castObjSquare("./bomb.glb", j.position.x, j.position.y, j.position.z, key, 1);
    }

    //console.log("cambio Online", value.rotation);
    //Posición
    let bombMesh = scene.getObjectByName(key);
    bombMesh.position.x = value.x;
    bombMesh.position.z = value.z;
    //BoundingBox
    let col = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    col.setFromObject(bombMesh);
    //console.log(col); 
    // Haciendo col accesible externamente
    bombMesh.userData.boundingBox = col;
    bombMesh.position.x = value.x;
    bombMesh.position.z = value.z;
  });
});
//Escribir
function writeBombData(positionX, positionZ, id) {
  set(ref(db, "bomb/" + id), {
    x: positionX,
    z: positionZ,
  });
}
function deleteBombData(id) {
  //console.log(userId);
  const eliminado = scene.getObjectByName(id);
  remove(ref(db, "bomb/" + id));
  eliminarModelo(eliminado);
}

function resize() {
  camera.aspect = canvas.innerWidth / canvas.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.innerWidth, canvas.innerHeight);
  renderer.render(scene, camera);
}
canvas.addEventListener("resize", resize);




var velocidad = 0.25; // Velocidad inicial del jugador
var life = true; //el usuario sigue vivo
document.addEventListener('keydown', function (e) {
  isAlive(currentUser.uid);
  if (life === true) {
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
        cambiarAccionExterna(1);
        generateBomb();

        break;


      default:
        // Otras teclas, si es necesario
        break;
    }

    if (!temporizadorIniciado) {
      //impTemp(true);
      var timer = document.getElementById("timer");
      timer.textContent = "ONLINE";
      temporizadorIniciado = true;
    }

    writeUserData(
      currentUser.uid,
      jugadorActual.position.x,
      jugadorActual.position.z,
      jugadorActual.rotation.y,
      2
    );
    checkCollisionB();
  }
  else {
    //Si ya no está vivo
    //Borramos los datos de firebase
    deleteBombData("bomb" + currentUser.uid);
    deleteUserData(currentUser.uid);
    //Redirigimos a otra ventana
    window.location.href = `Inicio.php`;
  }
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
//Verifica si en la base de datos la visibilidad es true
async function isAlive(userId) {
  // Lee el dato antes de eliminarlo
  const snapshot = await get(ref(db, "coop/" + userId));

  // Verifica si existe el dato antes de continuar
  if (snapshot.exists()) {
    console.log("Existe");
    life = true;
  } else {
    console.log("El usuario no existe o ya ha sido eliminado");
    life = false;
  }
}

//Función de generación de bombas
function generateBomb() {
  const j = scene.getObjectByName(currentUser.uid);
  writeBombData(j.position.x, j.position.z, "bomb" + currentUser.uid);
}
//Checar colisiones de bombas con usuario
function checkCollisionB() {
  // Verificamos por cada elemento del array...
  arrayUsers.forEach((id) => {
    // Si el id es diferente al nombre del usuario actual...
    if (id !== currentUser.uid) {
      const jugadorActual = scene.getObjectByName("bomb" + currentUser.uid); // Bomba

      // Verificamos si se encontró el objeto antes de continuar
      if (jugadorActual) {
        let playerBB, powerupMesh;
        playerBB = jugadorActual.userData.boundingBox; // Bounding box de la bomba
        console.log("bomb" + currentUser.uid, id);
        powerupMesh = scene.getObjectByName(id); // Obtenemos el modelo con id del usuario diferente

        // Si existe el boundingBox y el mesh con el id
        if (playerBB && powerupMesh) {
          // Obtenemos el bounding box del usuario
          const userBB = powerupMesh.userData.boundingBox;

          // Comprobamos la intersección
          if (userBB && playerBB.intersectsBox(userBB)) {
            // Colisión detectada
            soundEffect("explosion");
            deleteUserData(id);
            //Ya eliminado el rival, toca la del usuario
            deleteBombData("bomb" + currentUser.uid);
            deleteUserData(currentUser.uid);
            //Redirigimos a otra ventana
            window.location.href = `Inicio.php`;
          }
        }
      }
    }
  });
}

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