"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attachment = void 0;
const matrix4_1 = require("../webgl/matrix4");
const mesh_1 = require("../webgl/mesh");
const spine_slot_1 = require("./spine-slot");
const spine_utils_1 = require("./spine-utils");
class AttachmentVertex {
    constructor(attachment) {
        this.localPos = null;
        this.relatedBones = [];
        this.attachment = null;
        this.attachment = attachment;
    }
    calRealPos(spine, bone, slot) {
        let animation = spine.getAnimation();
        if (this.attachment.type == "mesh" && this.attachment.isWeighted) {
            let newX = 0, newY = 0;
            for (let weightBone of this.relatedBones) {
                let bone = spine.getBoneAt(weightBone.boneIndex);
                if (bone != null) {
                    let newPos = spine_utils_1.default.transformXYByMatrix(bone.worldTransform, weightBone.x, weightBone.y);
                    newX += newPos[0] * weightBone.w;
                    newY += newPos[1] * weightBone.w;
                }
            }
            return [newX, newY];
        }
        else if (this.attachment.type == "mesh") {
            let newPos = spine_utils_1.default.transformXYByMatrix(bone.worldTransform, this.x, this.y);
            return newPos;
        }
        else {
            if (this.localPos == null) {
                this.localPos = spine_utils_1.default.transformXYByMatrix(this.attachment.localTransform, this.x, this.y);
            }
            let newPos = spine_utils_1.default.transformXYByMatrix(bone.worldTransform, this.localPos[0], this.localPos[1]);
            return newPos;
        }
    }
}
class Attachment {
    constructor() {
        this.isWeighted = false;
        this.triangles = [];
        this.vertices = [];
        this.name = "";
        this.localTransform = new matrix4_1.default();
        this.skin = null;
        this.keyName = "";
        this.setupVertices = [];
    }
    setSkin(skin) {
        this.skin = skin;
    }
    setKeyName(keyName) {
        this.keyName = keyName;
    }
    setJson(json) {
        this.json = json;
        this.type = json.type != null ? json.type : "region";
        this.name = json.name != null ? json.name : "";
        if (this.type != "region" && this.type != "mesh") {
            console.warn("attchment type not supported now", this.type);
            return;
        }
        if (this.type == "mesh") {
            if (this.json.vertices.length > this.json.uvs.length) {
                this.isWeighted = true;
                this.setupVertices = [];
                let c = 0;
                while (c < this.json.vertices.length) {
                    let boneCount = this.json.vertices[c++];
                    let vertex = new AttachmentVertex(this);
                    for (let i = 0; i < boneCount; i++) {
                        let boneIndex = this.json.vertices[c++];
                        let x = this.json.vertices[c++];
                        let y = this.json.vertices[c++];
                        let w = this.json.vertices[c++];
                        vertex.relatedBones.push({
                            x: x, y: y, w: w, boneIndex: boneIndex
                        });
                        this.setupVertices.push(x, y);
                    }
                    this.vertices.push(vertex);
                }
                this.triangles = this.json.triangles;
            }
            else if (this.json.vertices.length == this.json.uvs.length) {
                this.setupVertices = [];
                let count = this.json.vertices.length / 2;
                for (let c = 0; c < count; c++) {
                    let vertex = new AttachmentVertex(this);
                    vertex.x = this.json.vertices[c * 2];
                    vertex.y = this.json.vertices[c * 2 + 1];
                    this.vertices.push(vertex);
                    this.setupVertices.push(vertex.x, vertex.y);
                }
                this.triangles = this.json.triangles;
            }
            let count = this.json.uvs.length / 2;
            for (let c = 0; c < count; c++) {
                this.vertices[c].u = this.json.uvs[c * 2];
                this.vertices[c].v = 1 - this.json.uvs[c * 2 + 1];
            }
        }
        else if (this.type == "region") {
            let points = [
                [-this.json.width / 2, this.json.height / 2, 0, 1],
                [-this.json.width / 2, -this.json.height / 2, 0, 0],
                [this.json.width / 2, this.json.height / 2, 1, 1],
                [this.json.width / 2, -this.json.height / 2, 1, 0]
            ];
            this.vertices = [];
            for (let p = 0; p < points.length; p++) {
                let v = new AttachmentVertex(this);
                v.x = points[p][0];
                v.y = points[p][1];
                v.u = points[p][2];
                v.v = points[p][3];
                this.vertices.push(v);
            }
            this.triangles = [0, 1, 2, 1, 3, 2];
        }
        spine_utils_1.default.updateTransformFromSRT(this.localTransform, this.json.rotation != null ? this.json.rotation : 0, this.json.scaleX != null ? this.json.scaleX : 1, this.json.scaleY != null ? this.json.scaleY : 1, 0, 0, this.json.x != null ? this.json.x : 0, this.json.y != null ? this.json.y : 0);
    }
    updateDeform(spine, bone, slot) {
        if (this.type != "mesh") {
            return;
        }
        let animation = spine.getAnimation();
        if (animation == null) {
            return;
        }
        animation.applyDeform(this.skin.name, slot.name, this);
    }
}
exports.Attachment = Attachment;
class SpineMesh extends mesh_1.default {
    constructor() {
        super(...arguments);
        this.slots = [];
        this.slotsDict = {};
        this.atlas = null;
        this.defaultSkin = null;
        this.skins = [];
    }
    setSpine(spine) {
        this.spine = spine;
    }
    createFromAtlas(atlas) {
        this.atlas = atlas;
        this.createSlots();
        this.createAttachments();
        this.setTexture(this.atlas.texture);
    }
    createSlots() {
        let data = this.spine.getData();
        for (let b of data.json.slots) {
            let slot = new spine_slot_1.default();
            slot.setJson(b);
            this.slots.push(slot);
            this.slotsDict[slot.name] = slot;
        }
    }
    createAttachments() {
        let data = this.spine.getData();
        let skins = data.json.skins;
        for (let skinJson of skins) {
            let skin = {
                name: skinJson.name
            };
            let attachments = {};
            for (let slotName in skinJson.attachments) {
                for (let attachmentName in skinJson.attachments[slotName]) {
                    let attachmentJson = skinJson.attachments[slotName][attachmentName];
                    let attachment = new Attachment();
                    attachment.setJson(attachmentJson);
                    attachment.setSkin(skin);
                    attachment.setKeyName(attachmentName);
                    if (attachments[slotName] == null) {
                        attachments[slotName] = {};
                    }
                    attachments[slotName][attachmentName] = attachment;
                }
            }
            skin.attachments = attachments;
            if (skin.name == "default") {
                this.defaultSkin = skin;
            }
            else {
                this.skins.push(skin);
            }
        }
        console.log(this.skins, this.defaultSkin);
    }
    getAttachment(slot) {
        let slotInfo = this.defaultSkin.attachments[slot.name];
        if (slotInfo == null) {
            for (let skin of this.skins) {
                slotInfo = skin.attachments[slot.name];
                if (slotInfo != null) {
                    break;
                }
            }
        }
        if (slotInfo == null) {
            return null;
        }
        let animation = this.spine.getAnimation();
        let currentAttachment = slot.attachment;
        if (animation != null) {
            let animationAttachment = animation.getAttachmentName(slot.name);
            if (animationAttachment == null) {
                return null;
            }
            else if (animationAttachment == "") {
            }
            else {
                currentAttachment = animationAttachment;
            }
        }
        let attachment = slotInfo[currentAttachment];
        return attachment;
    }
    preDraw() {
        let indices = [];
        let points = [];
        for (let slot of this.slots) {
            let bone = this.spine.getBone(slot.bone);
            let attachment = this.getAttachment(slot);
            let regionName = slot.attachment;
            if (attachment && attachment.name != "") {
                regionName = attachment.name;
            }
            let region = this.atlas.getRegion(regionName);
            if (bone && attachment && region) {
                attachment.updateDeform(this.spine, bone, slot);
                let vertices = attachment.vertices;
                let startIndex = points.length;
                for (let vert of vertices) {
                    let newPos = vert.calRealPos(this.spine, bone, slot);
                    let realU = vert.u * region.uLen + region.u1;
                    let realV = vert.v * region.vLen + region.v1;
                    points.push([newPos[0], newPos[1], realU, realV]);
                }
                for (let index of attachment.triangles) {
                    indices.push(index + startIndex);
                }
            }
        }
        this.points = points;
        this.indices = new Uint16Array(indices);
        this.x = this.spine.x;
        this.y = this.spine.y;
        this.setVertsDiry();
        this.setVertsIndexDiry();
    }
}
exports.default = SpineMesh;
//# sourceMappingURL=spine-mesh.js.map