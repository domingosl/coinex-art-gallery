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
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

const listener = new THREE.AudioListener();

const gltfLoader = new GLTFLoader();
const scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.add(listener);

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

    let gallery;
    const galleryPreset = galleriesPresets.findById(id);

    console.log("Gallery Preset:", galleryPreset);

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

            scene.add(cameraGroup);

            const rafCallbacks = new Set();


            let sound = new THREE.Audio( listener );



            renderer.xr.addEventListener('sessionstart', function () {

                cameraGroup.position.x = galleryPreset.camera.position.x;
                cameraGroup.position.z = galleryPreset.camera.position.z;

                const { controller1, controller2 } = controllers.load(renderer, cameraGroup);
                locomotion.load(scene, renderer, camera, cameraGroup, rafCallbacks, controller1, controller2);

                // load a sound and set it as the Audio object's buffer
                const audioLoader = new THREE.AudioLoader();
                audioLoader.load( '/assets/music/ambient.mp3', function( buffer ) {
                    sound.setBuffer( buffer );
                    sound.setLoop( true );
                    sound.setVolume( 0.1 );
                    sound.play();
                });

            });

            renderer.xr.addEventListener('sessionend', function () {
                sound.stop();
            });

            window.addEventListener('resize', onWindowResize, false);
            onWindowResize();

            //const controls = new OrbitControls(camera, renderer.domElement);


            renderer.setAnimationLoop(function (time ,frame) {
                rafCallbacks.forEach(cb => cb(time, frame));
                renderer.render( scene, camera );
                //controls.update();
            });

            resolve(gallery);

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

    const gallery = await init3d(galleryIndex);

    const galleryPreset = galleriesPresets.findById(galleryIndex);

    const promises = [];
    for(const painting in paintings) {
        promises.push(await displayPainting(
            gallery,
            paintings[painting].posX,
            paintings[painting].posY,
            paintings[painting].posZ,
            paintings[painting].rotX,
            paintings[painting].rotY,
            paintings[painting].rotZ,
            paintings[painting].width,
            paintings[painting].aspect,
            galleryPreset.textSize,
            paintings[painting].url
        ));
    }

    await Promise.allSettled(promises);
    scene.add(gallery);

    loader.hide();

};

loadGallery();