const data = [
    {
        id: 1,
        name: "Small Open Space",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque rutrum interdum felis elementum mattis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        location: "assets/gallery-1/scene.gltf",
        thumbnailURL: "https://picsum.photos/200/200",
        paintings: [
            {
                pos: { x: 0, y: 1500, z: -4900 },
                rotation: { x: 0, y: 0, z: 0 }
            },
            {
                pos: { x: -3000, y: 1500, z: -4900 },
                rotation: { x: 0, y: 0, z: 0 }
            },
            {
                pos: { x: 3000, y: 1500, z: -4900 },
                rotation: { x: 0, y: 0, z: 0 }
            }
        ],
        camera: {
            position: {
                x: 0,
                y: 1.6,
                z: 3.2
            },
            fov: 75
        },
        scene: {
            scale: 1,
            position: {
                x: 0,
                y: 0,
                z: 0
            }
        }
    },
    {
        id: 2,
        name: "Small Centric",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque rutrum interdum felis elementum mattis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        location: "assets/gallery-2/scene.gltf",
        thumbnailURL: "https://picsum.photos/200/200",
        paintings: [
            {
                pos: { x: 0, y: 0, z: 0 },
                rotation: { x: 0, y: 0, z: 0 }
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
        }
    }
];

module.exports = {
    findById: id => {
        return data.find(p => p.id === id);
    },
    list: () => data
}