"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const matrix4_1 = require("../webgl/matrix4");
class SpineBone {
    constructor() {
        this.json = null;
        this.worldTransform = new matrix4_1.default();
        this.localTransform = new matrix4_1.default();
    }
    setJson(json) {
        this.json = json;
    }
    get name() {
        return this.json.name != null ? this.json.name : "";
    }
    get length() {
        return this.json.length != null ? this.json.length : 0;
    }
    get parent() {
        return this.json.parent != null ? this.json.parent : "";
    }
    get setupX() {
        return this.json.x != null ? this.json.x : 0;
    }
    get setupY() {
        return this.json.y != null ? this.json.y : 0;
    }
    get setupRotation() {
        return this.json.rotation != null ? this.json.rotation : 0;
    }
    updateWorldTransform(parent) {
        if (parent) {
            this.localTransform.multiply(parent.worldTransform, this.worldTransform);
        }
        else {
            this.worldTransform.setArrayValue(this.localTransform.arrayValue);
        }
    }
}
exports.default = SpineBone;
//# sourceMappingURL=spine-bone.js.map