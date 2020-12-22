"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mesh_1 = require("../webgl/mesh");
const spine_slot_1 = require("./spine-slot");
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
            }
            else if (this.json.vertices.length == this.json.uvs.length) {
                let count = this.json.vertices.length / 2;
                for (let c = 0; c < count; c++) {
                    let vertex = new AttachmentVertex();
                    vertex.x = this.json.vertices[c * 2];
                    vertex.y = this.json.vertices[c * 2 + 1];
                    this.vertices.push(vertex);
                }
            }
            let count = this.json.uvs.length / 2;
            for (let c = 0; c < count; c++) {
                this.vertices[c].u = this.json.uvs[c * 2];
                this.vertices[c].v = this.json.uvs[c * 2 + 1];
            }
        }
    }
    getVertexCount() {
        return this.vertices.length;
    }
}
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
    getAttachment(slotName, attachmentName) {
        return this.attachments[slotName][attachmentName];
    }
    updateFromSpineBones() {
    }
    onTextureSet() {
        super.onTextureSet();
    }
    update() {
    }
    draw() {
    }
}
exports.default = SpineMesh;
//# sourceMappingURL=spine-mesh.js.map