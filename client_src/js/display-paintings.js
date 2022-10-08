import * as THREE from 'three';
import ui from "./ui";

const loader = new THREE.TextureLoader();

let paintingsMeshCache = [];

const acceptedAspectRatios = [
    { w: 1, h: 1.618 }, //Golden ratio
    { w: 3, h: 4 },
    { w: 7, h: 5 },
    { w: 4, h: 5 },
    { w: 6, h: 5 },
    { w: 11, h: 14 },
    { w: 1, h: 1 },
    { w: 1, h: 2 },
    { w: 7, h: 9 },
    { w: 2, h: 3 }
];

const displayPainting = async (
    scene,
    x = 0,
    y = 0,
    z = 0,
    xRot = 0,
    yRot = 0,
    zRot = 0,
    width = 0.5,
    ar,
    textSize,
    imageURL) => new Promise((resolve, reject) => {

    console.log("Displaying painting", {x,y,z,xRot,yRot,zRot,width,ar,imageURL});

    const material = new THREE.MeshBasicMaterial();
    const texture = loader.load(imageURL, async (_texture) => {
        console.log("Texture loaded!", imageURL);

        _texture.matrixAutoUpdate = false;

        const aspect = ar/1000;
        const imageAspect = _texture.image.width / _texture.image.height;

        if (aspect < imageAspect) {
            texture.matrix.setUvTransform(0, 0, aspect / imageAspect, 1, 0, 0.5, 0.5);
        } else {
            texture.matrix.setUvTransform(0, 0, 1, imageAspect / aspect, 0, 0.5, 0.5);
        }

        const geometry = new THREE.PlaneGeometry(width/1000, (width/1000) / aspect);

        material.map = _texture;

        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(x/1000, y/1000, z/1000);
        mesh.rotation.set(xRot/1000, yRot/1000, zRot/1000);

        await ui.displayTextBox(
            mesh,
            "NFT: Painting name is veryyyyyyyyyy looooooong!!!!\nBy XXX",
            textSize,
            "left",
            {x:-width/2000,y:-(width/2000) / aspect,z:0},
            {x:0,y:0,z:0}
        );

        scene.add(mesh);

        paintingsMeshCache.push(mesh);

        resolve();
    }, ()=>{},
        (error, foo)=>{
        reject({error, foo});
    });

});

function clearPaintings(scene) {
    paintingsMeshCache.forEach(painting => scene.remove(painting));
    paintingsMeshCache = [];
}

module.exports.acceptedAspectRatios = acceptedAspectRatios;
module.exports.displayPainting = displayPainting;
module.exports.clearPaintings = clearPaintings;