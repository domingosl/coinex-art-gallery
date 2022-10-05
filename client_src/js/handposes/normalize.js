import { Matrix4 } from 'three';

export default function normalize(handPose) {

    const size = handPose.length/16;

    const inverseWristMat = new Matrix4();
    inverseWristMat.fromArray(handPose, 0);
    inverseWristMat.invert();

    const tempMat = new Matrix4();
    for (let i=0; i<size; i++) {
        const offset = i*16;
        tempMat.fromArray(handPose, offset);
        tempMat.premultiply(inverseWristMat);
        tempMat.toArray(handPose, offset);
    }
}