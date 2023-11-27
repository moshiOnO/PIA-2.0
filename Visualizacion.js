import * as THREE from "./three.module.js";
import { OrbitControls } from "./OrbitControls.js";

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



let clock = new THREE.Clock();

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

camera.position.set(0, 0, 10);

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

castPJ("./bomberman.glb", "monsterModel", "meshID", 0);



//Bomberman//
/*
const MONSTORGLTF = new GLTFLoader();
let monstOrModel; 
let monstOrMixer; 
        MONSTORGLTF.load("./bomberman.glb", function (modelGLTF4) {
          monstOrModel = modelGLTF4.scene;
          monstOrModel.scale.set(1, 1, 1);
          monstOrModel.position.set(-15, -0.5, -15);
          scene.add(monstOrModel);
          if (modelGLTF4.animations && modelGLTF4.animations.length > 0) {
            monstOrMixer = new THREE.AnimationMixer(monstOrModel);


            const clipAction = monstOrMixer.clipAction(modelGLTF4.animations[0]);
            clipAction.play();
          }
        });
        function animate2() {
          if (monstOrMixer) {
            monstOrMixer.update(0.01);
          }
          renderer.render(scene, camera);
          requestAnimationFrame(animate2);
        }        
      animate2();
*/
/*
        //Altair 2
        const MONSTIRGLTF = new GLTFLoader();
        let monstIrModel; 
        let monstIrMixer; 
        MONSTIRGLTF.load("./altair.glb", function (modelGLTF4) {
          monstIrModel = modelGLTF4.scene;
          monstIrModel.scale.set(1, 1, 1);
          monstIrModel.position.set(11, -0.5, 15);
          scene.add(monstIrModel);
          if (modelGLTF4.animations && modelGLTF4.animations.length > 0) {
            monstIrMixer = new THREE.AnimationMixer(monstIrModel);
            const clipAction = monstIrMixer.clipAction(modelGLTF4.animations[1]);
            clipAction.play();
          }
        });
        function animate3() {
          if (monstIrMixer) {
            monstIrMixer.update(0.01);
          }
          renderer.render(scene, camera);
          requestAnimationFrame(animate3);
        }        
      animate3();  
*/

/*
      //Altair 3
      const MONSTIRGLTF2 = new GLTFLoader();
      let monstIrModel2; 
      let monstIrMixer2; 
      MONSTIRGLTF2.load("./altair.glb", function (modelGLTF4) {
        monstIrModel2 = modelGLTF4.scene;
        monstIrModel2.scale.set(1, 1, 1);
        monstIrModel2.position.set(11, -0.5, 10);
        scene.add(monstIrModel2);

        if (modelGLTF4.animations && modelGLTF4.animations.length > 0) {
          monstIrMixer2 = new THREE.AnimationMixer(monstIrModel2);
          const clipAction = monstIrMixer2.clipAction(modelGLTF4.animations[2]);
          clipAction.play();
        }
      });
      function animate4() {
        if (monstIrMixer2) {
          monstIrMixer2.update(0.01);
        }
        renderer.render(scene, camera);
        requestAnimationFrame(animate4);
      }        
    animate4();   
*/
/*
    //Altair 4
    const MONSTIRGLTF3 = new GLTFLoader();
    let monstIrModel3; 
    let monstIrMixer3; 
    MONSTIRGLTF3.load("./altair.glb", function (modelGLTF4) {
      monstIrModel3 = modelGLTF4.scene;
      monstIrModel3.scale.set(1, 1, 1);
      monstIrModel3.position.set(15, -0.5, 10);
      scene.add(monstIrModel3);

      if (modelGLTF4.animations && modelGLTF4.animations.length > 0) {
        monstIrMixer3 = new THREE.AnimationMixer(monstIrModel3);
        const clipAction = monstIrMixer3.clipAction(modelGLTF4.animations[3]);
        clipAction.play();
      }
    });
    function animate5() {
      if (monstIrMixer3) {
        monstIrMixer3.update(0.01);
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate5);
    }        
  animate5();   
*/
/*
   //Bomberman2//
const MONSTORGLTF2 = new GLTFLoader();
let monstOrModel2; 
let monstOrMixer2; 
        MONSTORGLTF2.load("./bomberman.glb", function (modelGLTF4) {
          monstOrModel2 = modelGLTF4.scene;
          monstOrModel2.scale.set(1, 1, 1);
          monstOrModel2.position.set(-10, -0.5, -15);
          scene.add(monstOrModel2);
          if (modelGLTF4.animations && modelGLTF4.animations.length > 0) {
            monstOrMixer2 = new THREE.AnimationMixer(monstOrModel2);
            const clipAction = monstOrMixer2.clipAction(modelGLTF4.animations[1]);
            clipAction.play();
          }
        });
        function Banimate2() {
          if (monstOrMixer2) {
            monstOrMixer2.update(0.01);
          }
          renderer.render(scene, camera);
          requestAnimationFrame(Banimate2);
        }        
      Banimate2();
*/
/*
        //Bomberman3//
const MONSTORGLTF3 = new GLTFLoader();
let monstOrModel3; 
let monstOrMixer3; 
        MONSTORGLTF3.load("./bomberman.glb", function (modelGLTF4) {
          monstOrModel3 = modelGLTF4.scene;
          monstOrModel3.scale.set(1, 1, 1);
          monstOrModel3.position.set(-15, -0.5, -10);
          scene.add(monstOrModel3);
          if (modelGLTF4.animations && modelGLTF4.animations.length > 0) {
            monstOrMixer3 = new THREE.AnimationMixer(monstOrModel3);
            const clipAction = monstOrMixer3.clipAction(modelGLTF4.animations[2]);
            clipAction.play();
          }
        });
        function Banimate3() {
          if (monstOrMixer3) {
            monstOrMixer3.update(0.01);
          }
          renderer.render(scene, camera);
          requestAnimationFrame(Banimate3);
        }        
      Banimate3();
*/
/*
      //Bomberman4//
const MONSTORGLTF4 = new GLTFLoader();
let monstOrModel4; 
let monstOrMixer4; 
        MONSTORGLTF4.load("./bomberman.glb", function (modelGLTF4) {
          monstOrModel4 = modelGLTF4.scene;
          monstOrModel4.scale.set(1, 1, 1);
          monstOrModel4.position.set(-10, -0.5, -6);
          scene.add(monstOrModel4);
          if (modelGLTF4.animations && modelGLTF4.animations.length > 0) {
            monstOrMixer4 = new THREE.AnimationMixer(monstOrModel4);
            const clipAction = monstOrMixer4.clipAction(modelGLTF4.animations[3]);
            clipAction.play();
          }
        });
        function Banimate4() {
          if (monstOrMixer4) {
            monstOrMixer4.update(0.01);
          }
          renderer.render(scene, camera);
          requestAnimationFrame(Banimate4);
        }        
      Banimate4();
*/






const loaderGLTF = new GLTFLoader();
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
    console.log(`${key} ${value.x} ${value.z}`);

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

document.onkeydown = function (e) {
  const jugadorActual = scene.getObjectByName(currentUser.uid);
  //console.log(jugadorActual.position.x);

  if (e.keyCode == 37) {
    jugadorActual.position.x -= 1;
    cambiarAccionExterna(2);
  }

  if (e.keyCode == 39) {
    jugadorActual.position.x += 1;
    cambiarAccionExterna(2);
  }

  if (e.keyCode == 38) {
    jugadorActual.position.z -= 1;
    cambiarAccionExterna(2);
    //castPJ("./altair.glb", "monsterModel", currentUser.uid, 3);
  }

  if (e.keyCode == 40) {
    jugadorActual.position.z += 1;
    cambiarAccionExterna(2);
  }

  writeUserData(
    currentUser.uid,
    jugadorActual.position.x,
    jugadorActual.position.z
  );
};

document.addEventListener('keyup', (event) => {
  cambiarAccionExterna(0);
});

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