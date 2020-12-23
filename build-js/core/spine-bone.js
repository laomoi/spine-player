"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const matrix4_1 = require("../webgl/matrix4");
const spine_utils_1 = require("./spine-utils");
class SpineBone {
    constructor() {
        this.json = null;
        this.worldTransform = new matrix4_1.default();
        this.localTransform = new matrix4_1.default();
    }
    setJson(json) {
        this.json = json;
        this.name = json.name;
        this.length = json.length != null ? json.length : 0;
        this.parent = json.parent != null ? json.parent : "";
        this.setupPosValue = {
            x: json.x != null ? json.x : 0,
            y: json.y != null ? json.y : 0,
            rotation: json.rotation != null ? json.rotation : 0,
            shearX: json.shearX != null ? json.shearX : 0,
            shearY: json.shearY != null ? json.shearY : 0,
            scaleX: json.scaleX != null ? json.scaleX : 1,
            scaleY: json.scaleY != null ? json.scaleY : 1
        };
        this.setupPos();
    }
    setupPos() {
        this.x = this.setupPosValue.x;
        this.y = this.setupPosValue.y;
        this.rotation = this.setupPosValue.rotation;
        this.shearX = this.setupPosValue.shearX;
        this.shearY = this.setupPosValue.shearY;
        this.scaleX = this.setupPosValue.scaleX;
        this.scaleY = this.setupPosValue.scaleY;
    }
    updateTransform(parent) {
        spine_utils_1.default.updateTransformFromSRT(this.localTransform, this.rotation, this.scaleX, this.scaleY, this.shearX, this.shearY, this.x, this.y);
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