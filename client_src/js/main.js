import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const gltfLoader = new GLTFLoader();
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);



const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#litle-verse"),
    alpha: true,
    antialias: true
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

function resizeCanvasToDisplaySize() {
    const canvas = renderer.domElement;

    // look up the size the canvas is being displayed
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // adjust displayBuffer size to match
    if (canvas.width !== width || canvas.height !== height) {
        // you must pass false here or three.js sadly fights the browser
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        // update any render target sizes here
    }
}

let isoGallery;
gltfLoader.load(
    "assets/gallery-2/scene.gltf",
    function (gltf) {
        isoGallery = gltf.scene;
        //isoGallery.rotation.x = 0.5;
        //isoGallery.rotation.y = 3.1;
        scene.add(isoGallery);
        resizeCanvasToDisplaySize();
    },
    (xhr) => {
        //console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    (error) => {
        console.log(error);
    }
);

camera.position.setZ(160);
camera.position.setY(50);

window.addEventListener("resize", resizeCanvasToDisplaySize, false);

resizeCanvasToDisplaySize();

function animate() {
    requestAnimationFrame(animate);

    isoGallery ? isoGallery.rotation.y += 0.003 * Math.sin(new Date().getTime() / 10000) : null;

    renderer.render(scene, camera);
}

animate();