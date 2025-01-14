import * as THREE from 'three';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';

const data = [
    {
        id: 1,
        enabled: true,
        name: "Small Open Space",
        description: "This setting allows you to publish up to 9 paintings in many available canvas sizes, ideal for frame-less paintings.",
        location: "assets/gallery-1/scene.gltf",
        thumbnailURL: "assets/img/gallery-1.png",
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

            objLoader.load('assets/coinex/coinex_v2.obj', object => {

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
                object.scale.set(0.03, 0.03, 0.03);
                //object.rotation.x = Math.PI / 2;
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
        enabled: true,
        name: "Small Centric",
        description: "An small art gallery with space for a maximum of 4 paintings in 2/3 tall vertical canvas.",
        location: "assets/gallery-2/scene.gltf",
        thumbnailURL: "assets/img/gallery-2.png",
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

            loader.load('/assets/img/powered-by-csc.png', (_texture) => {

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
        enabled: false,
        name: "Big open space",
        description: ":::Work in progress::: A bigger gallery for up to 16 tall vertical canvas in 2/3 aspect ratio. At the time this gallery is closed for optimization re-work.",
        location: "assets/gallery-3/scene.gltf",
        thumbnailURL: "assets/img/gallery-3.png",
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
        textSize: 0.01
    }
];

module.exports = {
    findById: id => {
        return data.find(p => p.id === id);
    },
    list: () => data
}