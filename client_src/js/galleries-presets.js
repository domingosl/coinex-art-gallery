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
                z: 4.5
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0
            },
            fov: 75
        },
        scene: {
            scale: 1,
            position: {
                x: 0,
                y: 0,
                z: 0
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0
            }
        },
        textSize: 0.03,
        postRenderModifier: (gallery) => new Promise((resolve, reject) => {

            const objLoader = new OBJLoader();

            objLoader.load('assets/coinex/logo.obj', object => {

                const material = new THREE.MeshPhongMaterial({
                    color: 0x14141F,
                    metalness: 1.0,
                    roughness: 0.4,
                    ambientIntensity: 0.2,
                    aoMapIntensity: 1.0,
                    envMapIntensity: 1.0,
                    displacementScale: 2.436143, // from original model
                    normalScale: 1.0


                });
                object.scale.set(0.0025, 0.0025, 0.0025);
                object.rotation.x = Math.PI / 2;
                object.position.y = 1.4;
                object.position.z = -0.1;
                object.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        child.material = material;
                    }
                });

                const light1 = new THREE.PointLight("#FFFFFF", 2);
                light1.position.set(-3, 2, -3);
                light1.lookAt(0, 0, 0);
                light1.castShadow = true;
                const light2 = new THREE.PointLight("#FFFFFF", 2);
                light2.position.set(-3, 2, 3);
                light2.lookAt(0, 0, 0);
                light2.castShadow = true;
                gallery.add(light1);
                gallery.add(light2);

                const light = new THREE.AmbientLight(0xFFFFFF, 2);
                gallery.add(light);

                gallery.add(object);

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
                pos: {x: -28.5*1000, y: 48*1000, z: 3.7*1000},
                rotation: {x: 0, y: 0, z: 0},
                acceptedAspectRatios: [{w: 2, h: 3}],
                defaultPaintingWidth: 42*1000
            },
            {
                pos: {x: 48*1000, y: 48*1000, z: 3.7*1000},
                rotation: {x: 0, y: 0, z: 0},
                acceptedAspectRatios: [{w: 2, h: 3}],
                defaultPaintingWidth: 42*1000
            },
            {
                pos: {x: -28.5*1000, y: 48*1000, z: -3.7*1000},
                rotation: {x: 0, y: 1000*Math.PI, z: 0},
                acceptedAspectRatios: [{w: 2, h: 3}],
                defaultPaintingWidth: 42*1000
            },
            {
                pos: {x: 48*1000, y: 48*1000, z: -3.7*1000},
                rotation: {x: 0, y: 1000*Math.PI, z: 0},
                acceptedAspectRatios: [{w: 2, h: 3}],
                defaultPaintingWidth: 42*1000
            }
        ],
        camera: {
            position: {
                x: 0,
                y: 1.6,
                z: 4.2
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0
            },
            fov: 75
        },
        scene: {
            scale: 0.028,
            position: {
                x: 0,
                y: 0,
                z: 0
            },
            rotation: {
                x: 0,
                y: Math.PI / 3,
                z: 0
            }
        },
        textSize: 1,
        postRenderModifier: (gallery) => new Promise((resolve, reject) => {
            const loader = new THREE.TextureLoader();

            loader.load('/assets/img/powered-by-coinex.png', (_texture) => {

                const geometry = new THREE.PlaneGeometry(34, 69.5);
                const material = new THREE.MeshBasicMaterial({
                    side: THREE.DoubleSide
                });
                material.map = _texture;

                const mesh1 = new THREE.Mesh(geometry, material);
                mesh1.position.set(13.2, 48, -30.3);
                mesh1.rotation.set(0, Math.PI / 2, 0);
                gallery.add(mesh1);

                const mesh2 = new THREE.Mesh(geometry, material);
                mesh2.position.set(13.2, 48, 30.3);
                mesh2.rotation.set(0, Math.PI / 2, 0);
                gallery.add(mesh2);

                const mesh3 = new THREE.Mesh(geometry, material);
                mesh3.position.set(6.5, 48, -30.3);
                mesh3.rotation.set(0, -Math.PI / 2, 0);
                gallery.add(mesh3);

                const mesh4 = new THREE.Mesh(geometry, material);
                mesh4.position.set(6.5, 48, 30.3);
                mesh4.rotation.set(0, -Math.PI / 2, 0);
                gallery.add(mesh4);

                const light = new THREE.AmbientLight(0xFFFFFF, 20);
                gallery.add(light);

                console.log("AD loaded");
                resolve();

            });

        })
    },
    {
        id: 3,
        name: "Big open space",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque rutrum interdum felis elementum mattis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        location: "assets/gallery-3/scene.gltf",
        thumbnailURL: "https://picsum.photos/200/200",
        paintings: [
            {
                pos: {x: 0, y: 0, z: 0},
                rotation: {x: 0, y: 0, z: 0},
                acceptedAspectRatios: [{w: 2, h: 3}],
                defaultPaintingWidth: 2
            }
        ],
        camera: {
            position: {
                x: 0,
                y: 1.6,
                z: 0
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0
            },
            fov: 75
        },
        scene: {
            scale: 0.25,
            position: {
                x: 0,
                y: 0,
                z: 0
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0
            }
        },
        textSize: 1
    }
];

module.exports = {
    findById: id => {
        return data.find(p => p.id === id);
    },
    list: () => data
}