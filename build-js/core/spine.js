"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mesh_1 = require("../webgl/mesh");
const spine_bone_1 = require("./spine-bone");
class Spine {
    constructor(data) {
        this.bones = [];
        this.bonesDict = {};
        this.boneDebugMesh = null;
        this.showDebugBone = true;
        this.x = 0;
        this.y = 0;
        this.data = data;
        this.createBones();
        this.setupPos();
    }
    createBones() {
        for (let b of this.data.json.bones) {
            let bone = new spine_bone_1.default();
            bone.setJson(b);
            this.bones.push(bone);
            this.bonesDict[bone.name] = bone;
        }
        let boneDepthDict = {};
        for (let bone of this.bones) {
            this.calBoneDepth(bone, boneDepthDict);
        }
        this.bones.sort(function (a, b) {
            return boneDepthDict[a.name] - boneDepthDict[b.name];
        });
    }
    calBoneDepth(bone, dict) {
        if (dict[bone.name] != null) {
            return dict[bone.name];
        }
        if (bone.parent == "") {
            dict[bone.name] = 0;
        }
        else {
            let parentBone = this.bonesDict[bone.parent];
            let parentDepth = this.calBoneDepth(parentBone, dict);
            dict[bone.name] = parentDepth + 1;
        }
        return dict[bone.name];
    }
    setAnimation(animation) {
        if (this.data.hasAnimation(animation)) {
            this.animation = animation;
            this.resetAnimation();
        }
    }
    setupPos() {
    }
    resetAnimation() {
    }
    update() {
        for (let bone of this.bones) {
            let parent = this.bonesDict[bone.parent];
            bone.updateWorldTransform(parent);
        }
    }
    updateBoneDebugMesh() {
    }
    draw(renderer) {
        if (this.showDebugBone) {
            if (this.boneDebugMesh == null) {
                this.boneDebugMesh = new mesh_1.default(renderer);
                this.boneDebugMesh.x = this.x;
                this.boneDebugMesh.y = this.y;
            }
            else {
            }
        }
    }
}
exports.default = Spine;
//# sourceMappingURL=spine.js.map