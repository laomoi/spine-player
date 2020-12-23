"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attachment = void 0;
const mesh_1 = require("../webgl/mesh");
const spine_slot_1 = require("./spine-slot");
const spine_utils_1 = require("./spine-utils");
class AttachmentVertex {
    constructor() {
        this.relatedBones = [];
    }
    calPositionByBones() {
    }
}
class Attachment {
    constructor() {
        this.isWeighted = false;
        this.triangles = [];
        this.vertices = [];
    }
    setJson(json) {
        this.json = json;
        this.type = json.type != null ? json.type : "region";
        if (this.type != "region" && this.type != "mesh") {
            console.warn("attchment type not supported now", this.type);
            return;
        }
        if (this.type == "mesh") {
            if (this.json.vertices.length > this.json.uvs.length) {
                this.isWeighted = true;
                let c = 0;
                while (c < this.json.vertices.length) {
                    let boneCount = this.json.vertices[c++];
                    let vertex = new AttachmentVertex();
                    for (let i = 0; i < boneCount; i++) {
                        let boneIndex = this.json.vertices[c++];
                        let x = this.json.vertices[c++];
                        let y = this.json.vertices[c++];
                        let w = this.json.vertices[c++];
                        vertex.relatedBones.push({
                            x: x, y: y, w: w, boneIndex: boneIndex
                        });
                    }
                    this.vertices.push(vertex);
                }
                this.triangles = this.json.triangles;
            }
            else if (this.json.vertices.length == this.json.uvs.length) {
                let count = this.json.vertices.length / 2;
                for (let c = 0; c < count; c++) {
                    let vertex = new AttachmentVertex();
                    vertex.x = this.json.vertices[c * 2];
                    vertex.y = this.json.vertices[c * 2 + 1];
                    this.vertices.push(vertex);
                }
                this.triangles = [0, 1, 2, 1, 3, 2];
            }
            let count = this.json.uvs.length / 2;
            for (let c = 0; c < count; c++) {
                this.vertices[c].u = this.json.uvs[c * 2];
                this.vertices[c].v = this.json.uvs[c * 2 + 1];
            }
        }
        else if (this.type == "region") {
            let points = [
                [0, this.json.height, 0, 1],
                [0, 0, 0, 0],
                [this.json.width, this.json.height, 1, 1],
                [this.json.width, 0, 1, 0]
            ];
            this.vertices = [];
            for (let p = 0; p < points.length; p++) {
                let v = new AttachmentVertex();
                v.x = points[p][0];
                v.y = points[p][1];
                v.u = points[p][2];
                v.v = points[p][3];
                this.vertices.push(v);
            }
            this.triangles = [0, 1, 2, 1, 3, 2];
        }
        this.x = this.json.x || 0;
        this.y = this.json.y || 0;
    }
}
exports.Attachment = Attachment;
class SpineMesh extends mesh_1.default {
    constructor() {
        super(...arguments);
        this.slots = [];
        this.slotsDict = {};
        this.atlas = null;
        this.attachments = {};
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
        for (let skin of skins) {
            if (skin.name == "default") {
                this.defaultSkin = skin;
                break;
            }
        }
        if (this.defaultSkin == null) {
            this.defaultSkin = data.json.skins[0];
        }
        for (let slotName in this.defaultSkin.attachments) {
            for (let attachmentName in this.defaultSkin.attachments[slotName]) {
                let attachmentJson = this.defaultSkin.attachments[slotName][attachmentName];
                let attachment = new Attachment();
                attachment.setJson(attachmentJson);
                if (this.attachments[slotName] == null) {
                    this.attachments[slotName] = {};
                }
                this.attachments[slotName][attachmentName] = attachment;
            }
        }
        console.log(this.attachments);
    }
    getAttachment(slot) {
        let animation = this.spine.getAnimation();
        if (animation == null) {
            return this.attachments[slot.name][slot.attachment];
        }
        return null;
    }
    updateFromSpine() {
        if (this.indices == null) {
        }
        let indices = [];
        let points = [];
        for (let slot of this.slots) {
            let bone = this.spine.getBone(slot.bone);
            let attachment = this.getAttachment(slot);
            let region = this.atlas.getRegion(slot.attachment);
            if (bone && attachment && region) {
                let vertices = attachment.vertices;
                let startIndex = points.length / 4;
                for (let vert of vertices) {
                    let newPos = spine_utils_1.default.transformXYByMatrix(bone.worldTransform, vert.x + attachment.x, vert.y + attachment.y);
                    let realU = vert.u * region.uLen + region.u1;
                    let realV = vert.v * region.vLen + region.v1;
                    points.push(newPos[0], newPos[1], realU, realV);
                }
                for (let index of attachment.triangles) {
                    indices.push(index + startIndex);
                }
            }
        }
        this.points = points;
        this.indices = new Uint16Array(indices);
        this.setVertsDiry();
        this.setVertsIndexDiry();
    }
}
exports.default = SpineMesh;
//# sourceMappingURL=spine-mesh.js.map