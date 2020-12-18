"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SpineBone {
    constructor() {
        this.name = "";
        this.length = 0;
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
        this.parent = "";
    }
    get parentBone() {
        if (this.parent == "") {
            return null;
        }
        return null;
    }
}
exports.default = SpineBone;
//# sourceMappingURL=spine-bone.js.map