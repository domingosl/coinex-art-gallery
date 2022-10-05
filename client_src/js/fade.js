module.exports = (camera, cameraGroup) => {

    function locomotion(offset) {
        cameraGroup.position.add(offset);
    }

    return locomotion;

}