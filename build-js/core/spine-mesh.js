"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mesh_1 = require("../webgl/mesh");
const spine_atlas_1 = require("./spine-atlas");
const spine_slot_1 = require("./spine-slot");
class SpineMesh extends mesh_1.default {
    constructor() {
        super(...arguments);
        this.slots = [];
        this.slotsDict = {};
        this.atlas = null;
    }
    createFromAtlas(atlas, png) {
        this.atlas = new spine_atlas_1.default(atlas, png, this.renderer);
        this.createSlots();
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
    updateFromSpine() {
    }
    setSpine(spine) {
        this.spine = spine;
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