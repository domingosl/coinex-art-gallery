import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';


const loader = new FontLoader();

module.exports.displayTextBox = (scene, text, size, align, pos, rot) => new Promise((resolve, reject) => {

    loader.load( '/assets/fonts/helvetiker_bold.typeface.json', function ( font ) {

        const geometry = new TextGeometry(text, {
            font: font,
            size,
            height: 0.0001
        });

        const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        const mesh = new THREE.Mesh(geometry, material);

        geometry.computeBoundingBox();

        let posX;
        if(align === 'center')
            posX = pos.x - geometry.boundingBox.max.x/2;
        else if(align === 'left')
            posX = pos.x;

        mesh.position.set(posX, pos.y, pos.z + 0.02);
        mesh.rotation.set(rot.x, rot.y, rot.z);

        const bgGeometry = new THREE.PlaneGeometry(geometry.boundingBox.max.x * 1.1, geometry.boundingBox.max.y * 1.7);
        const bgMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);

        bgMesh.position.set(posX + geometry.boundingBox.max.x / 2, pos.y - geometry.boundingBox.max.y + 0.040, pos.z + 0.01);
        bgMesh.rotation.set(rot.x, rot.y, rot.z);

        scene.add(mesh);
        scene.add(bgMesh);


        resolve();

    });
});