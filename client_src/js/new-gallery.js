require('dotenv').config();

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Swal from 'sweetalert2';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const galleriesPresets = require('../js/galleries-presets');
const loader = require('../js/blocking-loader');
const { displayPainting, acceptedAspectRatios, clearPaintings } = require('../js/display-paintings');
const contractUtils = require('../js/contract-utils');

const gltfLoader = new GLTFLoader();

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#preview"),
    alpha: true,
    antialias: true
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

let scene;
let camera;
let gallery;
let animReqId;
let controls;
const defaultPaintingWidth = 1300;

function resizeCanvasToDisplaySize() {

    const canvas = renderer.domElement;

    // look up the size the canvas is being displayed
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // adjust displayBuffer size to match
    //if (canvas.width !== width || canvas.height !== height) {
        // you must pass false here or three.js sadly fights the browser
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        // update any render target sizes here
    //}
}

window.addEventListener("resize", resizeCanvasToDisplaySize, false);


function animate() {
    animReqId = requestAnimationFrame(animate);
    //gallery.rotation.y = 2 * Math.PI * Math.sin(new Date().getTime() / 10000);
    //gallery.rotation.y = 2*Math.PI/3;
    controls.update()
    renderer.render(scene, camera);
}


const loadPreview = (galleryId) => new Promise((resolve, reject) => {

    animReqId && cancelAnimationFrame( animReqId );
    const galleryPreset = galleriesPresets.findById(galleryId);

    gltfLoader.load(
        galleryPreset.location,
        async function (gltf) {

            gallery = gltf.scene;
            gallery.scale.set(galleryPreset.scene.scale, galleryPreset.scene.scale, galleryPreset.scene.scale);
            gallery.position.set(
                galleryPreset.scene.position.x,
                galleryPreset.scene.position.y,
                galleryPreset.scene.position.z);

            camera = new THREE.PerspectiveCamera(
                galleryPreset.camera.fov,
                window.innerWidth / window.innerHeight,
                0.1,
                1000
            );

            controls = new OrbitControls( camera, renderer.domElement );
            controls.enableKeys = false;
            controls.minPolarAngle = 10*Math.PI/180;
            controls.maxPolarAngle = Math.PI / 2.5;
            controls.maxDistance = 5;
            controls.minDistance = 4;

            controls.autoRotate = true;

            camera.position.set(
                galleryPreset.camera.position.x,
                galleryPreset.camera.position.y,
                galleryPreset.camera.position.z
            );
            scene = new THREE.Scene();

            if(typeof galleryPreset.postRenderModifier === 'function')
                await galleryPreset.postRenderModifier(gallery);

            scene.add(gallery);


            animate();
            resizeCanvasToDisplaySize();


            return resolve();

        },
        (xhr) => {},
        (error) => {
            console.log(error);
            return reject();
        }
    );

});

const checkIfImageExists = url => new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;

    if (img.complete) {
        resolve();
    } else {
        img.onload = () => {
            resolve();
        };

        img.onerror = () => {
            reject();
        };
    }
});

angular.module("newGallery", []).controller("main", [ "$scope", "$interval", function ($scope, $interval) {

    $scope.formData = {
        currentStep: 'gallerySelection',
        selectedGalleryId: 1,
        selectedGallery: galleriesPresets.findById(1),
        galleries: galleriesPresets.list(),
        paintings: null
    };

    $scope.selectGallery = id => {
        $scope.formData.selectedGallery = galleriesPresets.findById(id);
        loader.show();
        loader.showStatus("Loading 3d gallery, this could take a minute on slow connections");
        loadPreview(id).then(()=>{
            initializePaintings();
            loader.hide();
        });

    };

    $scope.goTo = step => $scope.formData.currentStep = step;

    const initializePaintings = () => {
        $scope.formData.paintings = [];
        for(let x = 0; x < $scope.formData.selectedGallery.paintings.length; x++) {
            const paintingAcceptedAspectRatios = $scope.formData.selectedGallery.paintings[x].acceptedAspectRatios;
            $scope.formData.paintings.push({ url: null, canvas: null, acceptedAspectRatios: paintingAcceptedAspectRatios || acceptedAspectRatios });
        }
    }

    const previewPaintings = async (validationOnly = false) => {

        let processPaintings = 0;
        !validationOnly && clearPaintings(gallery);

        for (let x = 0; x < $scope.formData.paintings.length; x++) {

            const paintingMeta = $scope.formData.paintings[x];
            const painting3dMeta = $scope.formData.selectedGallery.paintings[x];

            if(paintingMeta.url && paintingMeta.canvas === null) {
                return Promise.reject("Select all missing canvas aspect ratios");
            } else if(!paintingMeta.url)
                continue;

            loader.showStatus("Verifying painting URL #" + (x + 1));

            try {
                await checkIfImageExists(paintingMeta.url);
            }
            catch (e) {
                return Promise.reject("Painting URL #" + (x + 1) + ", does not look like a valid image.");
            }

            !validationOnly && loader.showStatus("Populating gallery");


            const _acceptedAspectRatios = paintingMeta.acceptedAspectRatios || acceptedAspectRatios;

            !validationOnly && displayPainting(
                gallery,
                parseInt(painting3dMeta.pos.x),
                parseInt(painting3dMeta.pos.y),
                parseInt(painting3dMeta.pos.z),
                parseInt(painting3dMeta.rotation.x),
                parseInt(painting3dMeta.rotation.y),
                parseInt(painting3dMeta.rotation.z),
                parseInt(painting3dMeta.defaultPaintingWidth ?  painting3dMeta.defaultPaintingWidth : defaultPaintingWidth),
                parseInt(1000*_acceptedAspectRatios[paintingMeta.canvas].w / _acceptedAspectRatios[paintingMeta.canvas].h),
                $scope.formData.selectedGallery.textSize,
                paintingMeta.url
            );

            processPaintings++;
        }

        if(processPaintings === 0)
            return Promise.reject("At least one painting is required");

    }

    $scope.previewPaintings = async () => {
        loader.show();
        try {
            await previewPaintings();
            loader.hide();
        }
        catch (message) {
            loader.hide();
            Swal.fire({
                title: 'Error!',
                text: message,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }

    }

    $scope.deployGallery = async () => {

        loader.show();

        try {
            await previewPaintings(true);
        }
        catch (message) {
            loader.hide();
            return Swal.fire({
                title: 'Error!',
                text: message,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }

        animReqId && cancelAnimationFrame( animReqId );



        const paintingsArr = [];

        for (let x = 0; x < $scope.formData.paintings.length; x++) {

            const paintingMeta = $scope.formData.paintings[x];
            const painting3dMeta = $scope.formData.selectedGallery.paintings[x];

            if(!paintingMeta.url)
                continue;

            const _acceptedAspectRatios = paintingMeta.acceptedAspectRatios || acceptedAspectRatios;

            paintingsArr.push([
                'foo', //TODO: Implement NFT name
                parseInt(painting3dMeta.pos.x),
                parseInt(painting3dMeta.pos.y),
                parseInt(painting3dMeta.pos.z),
                parseInt(painting3dMeta.rotation.x),
                parseInt(painting3dMeta.rotation.y),
                parseInt(painting3dMeta.rotation.z),
                parseInt(painting3dMeta.defaultPaintingWidth ?  painting3dMeta.defaultPaintingWidth : defaultPaintingWidth),
                parseInt(1000*_acceptedAspectRatios[paintingMeta.canvas].w / _acceptedAspectRatios[paintingMeta.canvas].h),
                paintingMeta.url
            ]);

        }

        try {
            loader.showStatus("Connecting to CoinEx network");
            await contractUtils.connectToCoinEx();
            loader.showStatus("Deploying contract and minting NFTs");
            const response = await contractUtils.deploy($scope.formData.selectedGalleryId, paintingsArr);

            const coinexChainExplorer = process.env.COINEX_TR_EXPLORER_TPL.replace('{{address}}', response.transactionHash);
            const galleryURL = process.env.GALLERY_URL_TPL.replace('{{address}}', response.contractAddress);

            loader.hide();

            Swal.fire({
                title: 'Gallery on chain!',
                html: "Your gallery have been published and the paitings have been minted as NFTs.<br />" +
                    "Access it from a VR capable browser here: <br/><a class='super-link' href='" + galleryURL + "'>" + galleryURL + "</a>.<br /><br />" +
                    "Or check your contract in the <a class='super-link' href='" + coinexChainExplorer + "'>CoinEx explorer</a>.",
                icon: 'success',
                showConfirmButton: false,
                showCloseButton: false,
                allowOutsideClick: false
            });

            console.log("Deploy completed!", response);
        }
        catch (e) {
            loader.hide();
            Swal.fire({
                title: 'Error!',
                text: 'Something went wrong, please check Metamask history and try again',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            animate();
        }


    }

    loader.show();
    initializePaintings();
    loadPreview($scope.formData.selectedGalleryId).then(()=>loader.hide());

}]);