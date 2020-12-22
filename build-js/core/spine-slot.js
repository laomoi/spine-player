"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SpineSlot {
    constructor() {
        this.json = null;
    }
    setJson(json) {
        this.json = json;
        this.name = json.name;
        this.bone = json.bone;
        this.attachment = json.attachment;
    }
    updateAnimation() {
    }
    updateTransform() {
    }
}
exports.default = SpineSlot;
//# sourceMappingURL=spine-slot.js.map