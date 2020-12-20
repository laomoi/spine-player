"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spine_bone_1 = require("./spine-bone");
const spine_debug_mesh_1 = require("./spine-debug-mesh");
class Spine {
    constructor(data) {
        this.bones = [];
        this.bonesDict = {};
        this.debugMesh = null;
        this.showDebugMesh = true;
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
    getBones() {
        return this.bones;
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
            bone.updateTransform(parent);
            console.log(bone);
        }
    }
    updateBoneDebugMesh() {
    }
    draw(renderer) {
        if (this.showDebugMesh) {
            if (this.debugMesh == null) {
                this.debugMesh = new spine_debug_mesh_1.default(renderer);
                this.debugMesh.setSpine(this);
            }
            this.debugMesh.updateFromSpine();
            this.debugMesh.draw();
        }
    }
}
exports.default = Spine;
//# sourceMappingURL=spine.js.map