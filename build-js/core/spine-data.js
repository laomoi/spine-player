"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SpineData {
    setJson(json) {
        this.json = json;
    }
    getAnimationData(animationName) {
        return this.json.animations[animationName];
    }
}
exports.default = SpineData;
//# sourceMappingURL=spine-data.js.map