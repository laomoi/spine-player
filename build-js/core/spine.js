"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spine_animation_1 = require("./spine-animation");
const spine_bone_1 = require("./spine-bone");
const spine_debug_mesh_1 = require("./spine-debug-mesh");
const spine_mesh_1 = require("./spine-mesh");
class Spine {
    constructor(data) {
        this.bones = [];
        this.sortedBones = [];
        this.bonesDict = {};
        this.debugMesh = null;
        this.showDebugMesh = true;
        this.spineAnimation = null;
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
            this.sortedBones.push(bone);
            this.bonesDict[bone.name] = bone;
        }
        let boneDepthDict = {};
        for (let bone of this.bones) {
            this.calBoneDepth(bone, boneDepthDict);
        }
        this.sortedBones.sort(function (a, b) {
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
    getSortedBones() {
        return this.sortedBones;
    }
    getBone(name) {
        return this.bonesDict[name];
    }
    createMesh(renderer, atlas) {
        this.mesh = new spine_mesh_1.default(renderer);
        this.mesh.setSpine(this);
        this.mesh.createFromAtlas(atlas);
    }
    getData() {
        return this.data;
    }
    setAnimation(animationName) {
        let animationJson = this.data.getAnimationData(animationName);
        if (animationJson != null) {
            this.spineAnimation = new spine_animation_1.default(this, animationJson);
        }
    }
    setupPos() {
        this.updateBonesTransform();
    }
    update() {
        if (this.spineAnimation == null) {
            return;
        }
        this.spineAnimation.update();
        this.updateBonesTransform();
    }
    updateBonesTransform() {
        for (let bone of this.sortedBones) {
            let parent = this.bonesDict[bone.parent];
            bone.updateTransform(parent);
        }
    }
    draw(renderer) {
        if (this.mesh) {
            this.mesh.updateFromSpineBones();
            this.mesh.draw();
        }
        if (this.showDebugMesh) {
            if (this.debugMesh == null) {
                this.debugMesh = new spine_debug_mesh_1.default(renderer);
                this.debugMesh.setSpine(this);
            }
            this.debugMesh.updateFromSpineBones();
            this.debugMesh.draw();
        }
    }
}
exports.default = Spine;
//# sourceMappingURL=spine.js.map