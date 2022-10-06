require('dotenv').config();

import Web3 from 'web3';
import abi from '../../contracts/abi.json';

const loader = require('../js/blocking-loader');
const galleriesPresets = require('../js/galleries-presets');
const controllers = require('./controllers');
const locomotion = require('./locomotion');

const { displayPainting, clearPaintings } = require('../js/display-paintings');

let gallery;
let web3;
let contract;

const contractAddrReg = new RegExp('^0x[a-fA-F0-9]{40}$');

const queryParams = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';

const gltfLoader = new GLTFLoader();
const scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const cameraGroup = new THREE.Group();
cameraGroup.add(camera);

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.shadowMap.enabled = true;

scene.background = new THREE.Color(135, 206, 235);
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.xr.enabled = true;


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}


window.init3d = (id) => new Promise((resolve, reject) => {

    const galleryPreset = galleriesPresets.findById(id);

    console.log("Gallery Preset", galleryPreset);

    gltfLoader.load(
        galleryPreset.location,
        async function (gltf) {

            gallery = gltf.scene;
            gallery.scale.set(galleryPreset.scene.scale, galleryPreset.scene.scale, galleryPreset.scene.scale);
            gallery.position.set(
                galleryPreset.scene.position.x,
                galleryPreset.scene.position.y,
                galleryPreset.scene.position.z);
            gallery.rotation.set(
                galleryPreset.scene.rotation.x,
                galleryPreset.scene.rotation.y,
                galleryPreset.scene.rotation.z);

            camera.fov = (galleryPreset.camera.fov);
            camera.updateProjectionMatrix();

            camera.position.set(
                galleryPreset.camera.position.x,
                galleryPreset.camera.position.y,
                galleryPreset.camera.position.z
            );

            if(typeof galleryPreset.postRenderModifier === 'function')
                await galleryPreset.postRenderModifier(gallery);

            scene.add(gallery);
            scene.add(cameraGroup);

            const rafCallbacks = new Set();

            renderer.xr.addEventListener('sessionstart', function () {
                //scene.position.z -= 2;
                cameraGroup.position.x = galleryPreset.camera.position.x;
                //cameraGroup.position.y = galleryPreset.camera.position.y;
                cameraGroup.position.z = galleryPreset.camera.position.z;
                console.log(cameraGroup);
                const { controller1, controller2 } = controllers.load(renderer, cameraGroup);
                locomotion.load(scene, renderer, camera, cameraGroup, rafCallbacks, controller1, controller2)
            });

            window.addEventListener('resize', onWindowResize, false);
            onWindowResize();

            //const controls = new OrbitControls(camera, renderer.domElement);


            renderer.setAnimationLoop(function (time ,frame) {
                rafCallbacks.forEach(cb => cb(time, frame));
                renderer.render( scene, camera );
                //controls.update();
            });

            resolve();

        },
        () => {},
        (error) => {
            console.log(error);
            reject();
        });

    document.body.appendChild(renderer.domElement);
    document.body.appendChild(VRButton.createButton(renderer));


});

window.loadGallery = async () => {

    if(!contractAddrReg.test(queryParams.g) && queryParams.g !== 'example1' && queryParams.g !== 'example2')
        return alert("Invalid Gallery Address!");

    web3 = new Web3(process.env.COINEX_NET_RPC_URL);

    contract = new web3.eth.Contract(abi,
        queryParams.g === 'example1' ?
            process.env.GALLERY_EXAMPLE_1 : queryParams.g === 'example2' ?
                process.env.GALLERY_EXAMPLE_2 : queryParams.g);

    loader.show();

    const galleryIndex = parseInt(await contract.methods.getGalleryIndex().call());

    const paintings = await contract.methods.getPaintings().call();

    console.log("Paintings", paintings);

    await init3d(galleryIndex);

    for(const painting in paintings) {
        displayPainting(
            gallery,
            paintings[painting].posX,
            paintings[painting].posY,
            paintings[painting].posZ,
            paintings[painting].rotX,
            paintings[painting].rotY,
            paintings[painting].rotZ,
            paintings[painting].width,
            paintings[painting].aspect,
            paintings[painting].url
        );
    }

    loader.hide();

};

loadGallery();