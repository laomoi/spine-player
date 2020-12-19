"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const spine_1 = require("../core/spine");
const spine_data_1 = require("../core/spine-data");
const spine_utils_1 = require("../core/spine-utils");
class TestSpine {
    constructor() {
        this._inited = false;
        this.spines = [];
    }
    init(renderer) {
        renderer.enableBlend();
        renderer.setAlphaBlendMode();
        let jsonFile = path.join(__dirname, "../../res/skeleton.json");
        let spineData = new spine_data_1.default();
        spineData.setJson(spine_utils_1.default.readJsonFile(jsonFile));
        let spine = new spine_1.default(spineData);
        spine.setAnimation("animation");
        this.spines.push(spine);
        this._inited = true;
    }
    run(renderer) {
        if (!this._inited) {
            this.init(renderer);
        }
        renderer.clear();
        for (let spine of this.spines) {
            spine.update();
        }
        for (let spine of this.spines) {
            spine.draw(renderer);
        }
    }
}
exports.default = TestSpine;
//# sourceMappingURL=test-spine.js.map