"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mesh_1 = require("../webgl/mesh");
const spine_utils_1 = require("./spine-utils");
class SpineDebugMesh extends mesh_1.default {
    setSpine(spine) {
        this.spine = spine;
        this.setImage("builtin/bone.png");
    }
    preDraw() {
        if (this.indices == null) {
            let bones = this.spine.getSortedBones();
            let pointsCount = 4 * bones.length;
            this.points = new Array(pointsCount);
            let indices = [];
            let indicesPerBone = [0, 1, 2, 1, 3, 2];
            for (let b = 0; b < bones.length; b++) {
                let startIndice = b * 4;
                for (let index of indicesPerBone) {
                    indices.push(index + startIndice);
                }
            }
            this.indices = new Uint16Array(indices);
        }
        let points = this.points;
        let bones = this.spine.getSortedBones();
        let boneHeight = this.texture.imageHeight;
        for (let b = 0; b < bones.length; b++) {
            let bone = bones[b];
            let pointsPerBone = [
                [0, boneHeight / 2, 0, 1],
                [0, -boneHeight / 2, 0, 0],
                [bone.length, boneHeight / 2, 1, 1],
                [bone.length, -boneHeight / 2, 1, 0],
            ];
            for (let p = 0; p < pointsPerBone.length; p++) {
                let pt = pointsPerBone[p];
                let newPos = spine_utils_1.default.transformXYByMatrix(bone.worldTransform, pt[0], pt[1]);
                points[4 * b + p] = [newPos[0], newPos[1], pt[2], pt[3]];
            }
        }
        this.x = this.spine.x;
        this.y = this.spine.y;
        this.setVertsDiry();
    }
}
exports.default = SpineDebugMesh;
//# sourceMappingURL=spine-debug-mesh.js.map