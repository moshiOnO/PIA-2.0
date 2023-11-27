import * as THREE from "./three.module.js";
import { OrbitControls } from "./OrbitControls.js";
import { impTemp } from "./javas/Temporizador.js"

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

import { GLTFLoader } from "./GLTFLoader.js";
//Necesario para animaciones
let clock = new THREE.Clock();
//Temporizador
let temporizadorIniciado = false;

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
      console.log(currentUser);
      writeUserData(currentUser.uid, 0, 0);
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

var canvas = document.getElementById("canvas");



const scene = new THREE.Scene();
scene.background = new THREE.Color("#34495E");

const camera = new THREE.PerspectiveCamera(
  60,
  canvas.width / canvas.height
);

//Camera settings
camera.position.set(0, 30, 40);
camera.lookAt(0,0,0);

var renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(canvas.width, canvas.height);
renderer.shadowMap.enabled = true;


const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(hemisphereLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 5, -1);
directionalLight.castShadow = true;
scene.add(directionalLight);

const planeGeometry = new THREE.PlaneGeometry(50, 50);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: "slategrey",
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
plane.rotateX(-Math.PI / 2);
plane.position.set(0, -0.5, 0);



//Altair//

//cast PJ
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



const loaderGLTF = new GLTFLoader();

async function castObjSquare(dirMesh, pX, pY, pz, nameMesh){
  loaderGLTF.load(
    dirMesh,
    function (modelGLTF) {
      //Carga de mesh
      const obj = modelGLTF.scene;
      obj.scale.set(1,1,1);
      obj.position.set(pX,pY,pz);
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

//castObj("./bomb.glb", 15, 1, -15);
castObjSquare("./zapatos.glb", 5, .5, 4, "speed");

/*
    loaderGLTF.load(
      "./bomb.glb",
      function (modelGLTF) {
        const obj = modelGLTF.scene;
        obj.scale.set(1,1,1);
        obj.position.set(15,1,-15);
        obj.castShadow = true;
        scene.add(obj);
      }
    );
*/
/*
      loaderGLTF.load(
        "./reloj_de_bolsillo.glb",
        function (modelGLTF) {
          const obj = modelGLTF.scene;
          obj.scale.set(0.25,0.25,0.25);
          obj.position.set(-10,5,20);
          obj.castShadow = true;
          scene.add(obj);
        }
      );
*/
/*
      loaderGLTF.load(
        "./stylized_eye.glb",
        function (modelGLTF) {
          const obj = modelGLTF.scene;
          obj.scale.set(1,1,1);
          obj.position.set(5,0.50,8);
          obj.castShadow = true;
          scene.add(obj);
        }
      );

      loaderGLTF.load(
        "./zapatos.glb",
        function (modelGLTF) {
          const obj = modelGLTF.scene;
          obj.scale.set(1,1,1);
          obj.position.set(5,0.50,4);
          obj.castShadow = true;
          scene.add(obj);
        }
      );
*/

// BORDES DEL ESCENARIO

loaderGLTF.load(
  "./metal.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.1, 0.1, 0.1);
    obj.position.set(22, 1, 25);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./metal.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.1, 0.1, 0.1);
    obj.position.set(15.5, 1, 25);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./metal.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.1, 0.1, 0.1);
    obj.position.set(9, 1, 25);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./metal.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.1, 0.1, 0.1);
    obj.position.set(2.5, 1, 25);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./metal.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.1, 0.1, 0.1);
    obj.position.set(-22, 1, 25);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./metal.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.1, 0.1, 0.1);
    obj.position.set(-15.5, 1, 25);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./metal.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.1, 0.1, 0.1);
    obj.position.set(-9, 1, 25);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./metal.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.1, 0.1, 0.1);
    obj.position.set(-2.5, 1, 25);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./metal.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.1, 0.1, 0.1);
    obj.position.set(22, 1, -25);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./metal.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.1, 0.1, 0.1);
    obj.position.set(15.5, 1, -25);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./metal.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.1, 0.1, 0.1);
    obj.position.set(9, 1, -25);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./metal.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.1, 0.1, 0.1);
    obj.position.set(2.5, 1, -25);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./metal.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.1, 0.1, 0.1);
    obj.position.set(-22, 1, -25);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./metal.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.1, 0.1, 0.1);
    obj.position.set(-15.5, 1, -25);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./metal.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.1, 0.1, 0.1);
    obj.position.set(-9, 1, -25);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./metal.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.1, 0.1, 0.1);
    obj.position.set(-2.5, 1, -25);
    obj.castShadow = true;
    scene.add(obj);
  }
);

loaderGLTF.load(
  "./CajaM.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.01, 0.01, 0.01);
    obj.position.set(27, 0, 0);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./CajaM.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.01, 0.01, 0.01);
    obj.position.set(27, 0, -4);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./CajaM.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.01, 0.01, 0.01);
    obj.position.set(27, 0, 4);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./CajaM.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.01, 0.01, 0.01);
    obj.position.set(27, 0, 8);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./CajaM.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.01, 0.01, 0.01);
    obj.position.set(27, 0, 12);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./CajaM.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.01, 0.01, 0.01);
    obj.position.set(27, 0, 16);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./CajaM.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.01, 0.01, 0.01);
    obj.position.set(27, 0, 20);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./CajaM.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.01, 0.01, 0.01);
    obj.position.set(27, 0, 24);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./CajaM.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.01, 0.01, 0.01);
    obj.position.set(27, 0, -8);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./CajaM.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.01, 0.01, 0.01);
    obj.position.set(27, 0, -12);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./CajaM.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.01, 0.01, 0.01);
    obj.position.set(27, 0, -16);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./CajaM.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.01, 0.01, 0.01);
    obj.position.set(27, 0, -20);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./CajaM.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.01, 0.01, 0.01);
    obj.position.set(-27, 0, 0);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./CajaM.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.01, 0.01, 0.01);
    obj.position.set(-27, 0, -4);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./CajaM.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.01, 0.01, 0.01);
    obj.position.set(-27, 0, 4);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./CajaM.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.01, 0.01, 0.01);
    obj.position.set(-27, 0, 8);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./CajaM.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.01, 0.01, 0.01);
    obj.position.set(-27, 0, 12);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./CajaM.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.01, 0.01, 0.01);
    obj.position.set(-27, 0, 16);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./CajaM.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.01, 0.01, 0.01);
    obj.position.set(-27, 0, 20);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./CajaM.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.01, 0.01, 0.01);
    obj.position.set(-27, 0, 24);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./CajaM.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.01, 0.01, 0.01);
    obj.position.set(-27, 0, -8);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./CajaM.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.01, 0.01, 0.01);
    obj.position.set(-27, 0, -12);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./CajaM.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.01, 0.01, 0.01);
    obj.position.set(-27, 0, -16);
    obj.castShadow = true;
    scene.add(obj);
  }
);
loaderGLTF.load(
  "./CajaM.glb",
  function (modelGLTF) {
    const obj = modelGLTF.scene;
    obj.scale.set(0.01, 0.01, 0.01);
    obj.position.set(-27, 0, -20);
    obj.castShadow = true;
    scene.add(obj);
  }
);

/*
     loaderGLTF.load(
       "./Moneda.glb",
       function (modelGLTF) {
         const obj = modelGLTF.scene;
         obj.scale.set(1,1,1);
         obj.position.set(0,0,0);
         obj.castShadow = true;
         scene.add(obj);
       }
     );

     loaderGLTF.load(
       "./box.glb",
       function (modelGLTF) {
         const obj = modelGLTF.scene;
         obj.scale.set(2,2,2);
         obj.position.set(5,0.75,-4);
         obj.castShadow = true;
         scene.add(obj);
       }
     );

     loaderGLTF.load(
       "./ice.glb",
       function (modelGLTF) {
         const obj = modelGLTF.scene;
         obj.scale.set(3,3,3);
         obj.position.set(5,-0.50,-8);
         obj.castShadow = true;
         scene.add(obj);
       }
     );
*/
// Leer

// const MONSTERGLTF = new GLTFLoader();
// let monsterMixer;
// MONSTERGLTF.load("./altair.glb", function (modelGLTF4) {
//   const monsterModel = modelGLTF4.scene;
//   monsterModel.scale.set(1, 1, 1);
//   monsterModel.position.set(15, -0.5, 15);
//   scene.add(monsterModel);
//   if (modelGLTF4.animations && modelGLTF4.animations.length > 0) {
//     monsterMixer = new THREE.AnimationMixer(monsterModel);
//     //0, 1, 2, 3
//     //Programar número de animación por reproducir (idle,bomb,run, dead)
//     const clipAction = monsterMixer.clipAction(modelGLTF4.animations[0]);
//     clipAction.play();
//   }
// });

// function animate() {
//   if (monsterMixer) {
//     monsterMixer.update(0.01);
//   }
//   renderer.render(scene, camera);
//   requestAnimationFrame(animate);
// }
// animate();

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
  });
});

//Escribir
function writeUserData(userId, positionX, positionZ) {
  set(ref(db, "jugadores/" + userId), {
    x: positionX,
    z: positionZ,
  });
}

function resize() {
  camera.aspect = canvas.innerWidth / canvas.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.innerWidth, canvas.innerHeight);
  renderer.render(scene, camera);
}

canvas.addEventListener("resize", resize);

document.addEventListener('keydown', function (e) {
  const jugadorActual = scene.getObjectByName(currentUser.uid);

  switch (e.key) {
    case 'ArrowLeft':
      jugadorActual.position.x -= .5;      
      var gradosDerecha = 270;
      var anguloDerecha = THREE.MathUtils.degToRad(gradosDerecha);
      jugadorActual.rotation.set(0, anguloDerecha, 0);
      cambiarAccionExterna(2);
      break;

    case 'ArrowRight':
      jugadorActual.position.x += .5;
      var gradosDerecha = 90;
      var anguloDerecha = THREE.MathUtils.degToRad(gradosDerecha);
      jugadorActual.rotation.set(0, anguloDerecha, 0);
      cambiarAccionExterna(2);
      break;

    case 'ArrowUp':
      jugadorActual.position.z -= .5;
      var gradosDerecha = 180;
      var anguloDerecha = THREE.MathUtils.degToRad(gradosDerecha);
      jugadorActual.rotation.set(0, anguloDerecha, 0);
      cambiarAccionExterna(2);
      break;

    case 'ArrowDown':
      jugadorActual.position.z += .5;
      var gradosDerecha = 0;
      var anguloDerecha = THREE.MathUtils.degToRad(gradosDerecha);
      jugadorActual.rotation.set(0, anguloDerecha, 0);
      cambiarAccionExterna(2);
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
    jugadorActual.position.z
  );

  checkcollision(1);


});


document.addEventListener('keyup', (event) => {
  //cambiarAccionExterna(0);
});

//Checar colisiones con powerups
function checkcollision(powerup) {
  let powerName;
  switch (powerup) {
    case 1:
      powerName = "speed";      
      break;
    default:
      break;
  }

  const jugadorActual = scene.getObjectByName(currentUser.uid);
  const powerupMesh = scene.getObjectByName(powerName);  

  // Asegúrate de que playerBB y powerupBB sean instancias de Box3
  let playerBB = jugadorActual.userData.boundingBox;
  let powerupBB = powerupMesh.userData.boundingBox; 

  // Comprueba la intersección
  if (playerBB.intersectsBox(powerupBB)) {
    console.log("¡Colisión detectada!");
  }
  
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

scene.add(plane);



const cameraControl = new OrbitControls(camera, renderer.domElement);