import Web3 from 'web3';
import abi from '../../contracts/abi.json';

const loader = require('../js/blocking-loader');
const galleriesPresets = require('../js/galleries-presets');

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
        function (gltf) {

            gallery = gltf.scene;
            gallery.scale.set(galleryPreset.scene.scale, galleryPreset.scene.scale, galleryPreset.scene.scale);
            gallery.position.set(
                galleryPreset.scene.position.x,
                galleryPreset.scene.position.y,
                galleryPreset.scene.position.z);

            camera.fov = (galleryPreset.camera.fov);

            camera.position.set(
                galleryPreset.camera.position.x,
                galleryPreset.camera.position.y,
                galleryPreset.camera.position.z
            );

            scene.add(gltf.scene);

            window.addEventListener('resize', onWindowResize, false);
            onWindowResize();

            renderer.setAnimationLoop(function () {
                renderer.render( scene, camera );
            });

            resolve();

        },
        () => {},
        (error) => {
            console.log(error);
            reject();
        });

/*    function onSelectStart() {
        userData.selectPressed = true;
    }

    function onSelectEnd() {
        userData.selectPressed = false;

    }*/

    let controller = renderer.xr.getController( 0 );

    const buildController = ( data ) => {
        let geometry, material;

        switch ( data.targetRayMode ) {

            case 'tracked-pointer':

                geometry = new THREE.BufferGeometry();
                geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
                geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );

                material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending } );

                return new THREE.Line( geometry, material );

            case 'gaze':

                geometry = new THREE.RingBufferGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
                material = new THREE.MeshBasicMaterial( { opacity: 0.5, transparent: true } );
                return new THREE.Mesh( geometry, material );

        }

    }

    controller.addEventListener( 'connected', function ( event ) {

        const mesh = buildController.call(self, event.data );
        mesh.scale.z = 0;
        scene.add( mesh );

    } );

    controller.addEventListener( 'disconnected', function () {

        scene.remove( this.children[ 0 ] );
        controller = null;
        controllerGrip = null;

    } );

    scene.add(controller);

    const controllerModelFactory = new XRControllerModelFactory();

    let controllerGrip = renderer.xr.getControllerGrip( 0 );
    controllerGrip.add( controllerModelFactory.createControllerModel( controllerGrip ) );
    scene.add( controllerGrip );

    const dolly = new THREE.Object3D();
    dolly.position.z = 5;
    dolly.add( camera );
    scene.add( dolly );

    const dummyCam = new THREE.Object3D();
    camera.add( dummyCam );

    document.body.appendChild(renderer.domElement);
    document.body.appendChild(VRButton.createButton(renderer));


});

window.loadGallery = async () => {

    if(!contractAddrReg.test(queryParams.g))
        return alert("Invalid Gallery Address!");

    web3 = new Web3("https://testnet-rpc.coinex.net");

    contract = new web3.eth.Contract(abi, queryParams.g);

    loader.show();

    const galleryIndex = parseInt(await contract.methods.getGalleryIndex().call());
    console.log(galleryIndex);
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