"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SpineData {
    setJson(json) {
        this.json = json;
    }
    getAnimationData(animationName) {
        return this.json.animations[animationName];
    }
    getAnimationList() {
        let list = [];
        for (let k in this.json.animations) {
            list.push(k);
        }
        return list;
    }
}
exports.default = SpineData;
//# sourceMappingURL=spine-data.js.map