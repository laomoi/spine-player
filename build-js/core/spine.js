"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spine_data_1 = require("./spine-data");
const spine_utils_1 = require("./spine-utils");
class Spine {
    constructor(jsonFile, atlasFile, pngFile) {
        this.data = new spine_data_1.default();
        this.data.fromJson(spine_utils_1.default.readJsonFile(jsonFile));
    }
    update() {
    }
    draw(renderer) {
    }
}
exports.default = Spine;
//# sourceMappingURL=spine.js.map