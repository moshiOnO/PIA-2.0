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
        apiKey: "AIzaSyAq9J9tQNzIXhZlNy0yBiUroUvJrttEBgI",
        authDomain: "pia-wcg.firebaseapp.com",
        databaseURL: "https://pia-wcg-default-rtdb.firebaseio.com",
        projectId: "pia-wcg",
        storageBucket: "pia-wcg.appspot.com",
        messagingSenderId: "890613599080",
        appId: "1:890613599080:web:a93221ef74d8ceba0c64dd"
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


      var renderer = new THREE.WebGLRenderer({canvas : canvas});
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
      const MONSTERGLTF = new GLTFLoader();        
        let monsterMixer; 
        MONSTERGLTF.load("./altair.glb", function (modelGLTF4) {
          const monsterModel  = modelGLTF4.scene;
          monsterModel.scale.set(1, 1, 1);
          monsterModel.position.set(15, -0.5, 15);
          scene.add(monsterModel);
          if (modelGLTF4.animations && modelGLTF4.animations.length > 0) {
            monsterMixer = new THREE.AnimationMixer(monsterModel);
                                                               //0, 1, 2, 3
                        //Programar número de animación por reproducir (idle,bomb,run, dead)
            const clipAction = monsterMixer.clipAction(modelGLTF4.animations[0]);
            clipAction.play();
          }     
        });

        function animate() {
          if (monsterMixer) {
            monsterMixer.update(0.01);
          }
          renderer.render(scene, camera);
          requestAnimationFrame(animate);
        }        
      animate();

//Bomberman//

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

        







      const loaderGLTF = new GLTFLoader();
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

      loaderGLTF.load(
        "./metalbox.glb",
        function (modelGLTF) {
          const obj = modelGLTF.scene;
          obj.scale.set(0.5,0.5,0.5);
          obj.position.set(5,-0.50,0);
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

      // Leer
      const starCountRef = ref(db, "jugadores");
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();

        Object.entries(data).forEach(([key, value]) => {
          console.log(`${key} ${value.x} ${value.z}`);

          const jugador = scene.getObjectByName(key);
          if (!jugador) {
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshPhongMaterial();
            const mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.position.set(value.x, 0, value.z);
            mesh.material.color = new THREE.Color(Math.random() * 0xffffff);
            mesh.name = key;
            scene.add(mesh);
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

        if (e.keyCode == 37) {
          jugadorActual.position.x -= 1;
        }

        if (e.keyCode == 39) {
          jugadorActual.position.x += 1;
        }

        if (e.keyCode == 38) {
          jugadorActual.position.z -= 1;
        }

        if (e.keyCode == 40) {
          jugadorActual.position.z += 1;
        }

        writeUserData(
          currentUser.uid,
          jugadorActual.position.x,
          jugadorActual.position.z
        );
      };

      scene.add(plane);

      const cameraControl = new OrbitControls(camera, renderer.domElement);