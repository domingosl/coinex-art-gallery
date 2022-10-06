import * as THREE from 'three';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';

const data = [
    {
        id: 1,
        name: "Small Open Space",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque rutrum interdum felis elementum mattis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        location: "assets/gallery-1/scene.gltf",
        thumbnailURL: "https://picsum.photos/200/200",
        paintings: [
            {pos: {x: 0, y: 1500, z: -4900}, rotation: {x: 0, y: 0, z: 0}},
            {pos: {x: -3000, y: 1500, z: -4900}, rotation: {x: 0, y: 0, z: 0}},
            {pos: {x: 3000, y: 1500, z: -4900}, rotation: {x: 0, y: 0, z: 0}},
            {pos: {x: -4980, y: 1500, z: 0}, rotation: {x: 0, y: parseInt(1000 * Math.PI / 2), z: 0}},
            {pos: {x: -4980, y: 1500, z: -3000}, rotation: {x: 0, y: parseInt(1000 * Math.PI / 2), z: 0}},
            {pos: {x: -4980, y: 1500, z: 3000}, rotation: {x: 0, y: parseInt(1000 * Math.PI / 2), z: 0}},
            {pos: {x: 4980, y: 1500, z: 0}, rotation: {x: 0, y: -parseInt(1000 * Math.PI / 2), z: 0}},
            {pos: {x: 4980, y: 1500, z: -3000}, rotation: {x: 0, y: -parseInt(1000 * Math.PI / 2), z: 0}},
            {pos: {x: 4980, y: 1500, z: 3000}, rotation: {x: 0, y: -parseInt(1000 * Math.PI / 2), z: 0}}
        ],
        camera: {
            position: {
                x: 0,
                y: 1.6,
                z: 4
            },
            fov: 50
        },
        scene: {
            scale: 1,
            position: {
                x: 0,
                y: 0,
                z: 0
            }
        },
        postRenderModifier: (gallery) => new Promise((resolve, reject) => {

            const objLoader = new OBJLoader();

            objLoader.load('assets/coinex/logo.obj', object => {

                const material = new THREE.MeshPhongMaterial({color: 0x14141F, shininess: 150});
                object.scale.set(0.0025, 0.0025, 0.0025);
                object.rotation.x = Math.PI / 2;
                object.position.y = 1.4;
                object.position.z = -0.1;
                object.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        child.material = material;
                    }
                });

                const light1 = new THREE.PointLight("#FFFFFF", 3);
                light1.position.set(-3, 2, -3);
                light1.lookAt(0, 0, 0);
                light1.castShadow = true;
                const light2 = new THREE.PointLight("#FFFFFF", 3);
                light2.position.set(-3, 2, 3);
                light2.lookAt(0, 0, 0);
                light2.castShadow = true;
                gallery.add(object);
                gallery.add(light1);
                gallery.add(light2);
                resolve();
            });

        })
    },
    {
        id: 2,
        name: "Small Centric",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque rutrum interdum felis elementum mattis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        location: "assets/gallery-2/scene.gltf",
        thumbnailURL: "https://picsum.photos/200/200",
        paintings: [
            {
                pos: {x: 0, y: 0, z: 0},
                rotation: {x: 0, y: 0, z: 0}
            }
        ],
        camera: {
            position: {
                x: 0,
                y: 1.6,
                z: 1.5
            },
            fov: 75
        },
        scene: {
            scale: 0.01,
            position: {
                x: 0,
                y: 1,
                z: 0
            }
        },
        postRenderModifier: (gallery) => new Promise((resolve, reject) => {
            const loader = new THREE.TextureLoader();

            const texture = loader.load('/assets/img/powered-by-coinex.png', (_texture) => {

                const geometry = new THREE.PlaneGeometry(33, 69);
                const material = new THREE.MeshBasicMaterial({
                    side: THREE.DoubleSide
                });
                material.map = _texture;

                const mesh = new THREE.Mesh(geometry, material);

                mesh.position.set(13.2, 48, -30.5);
                mesh.rotation.set(0, Math.PI / 2, 0);

                window.foo = mesh;

                gallery.add(mesh);
                console.log("AD loaded");
                resolve();

            });

        })
    }
];

module.exports = {
    findById: id => {
        return data.find(p => p.id === id);
    },
    list: () => data
}