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
        let jsonFile = path.join(__dirname, "../../res/hero_alva.json");
        let spineData = new spine_data_1.default();
        spineData.setJson(spine_utils_1.default.readJsonFile(jsonFile));
        let spine = new spine_1.default(spineData);
        spine.setAnimation("animation");
        spine.x = 100;
        spine.y = 100;
        this.spines.push(spine);
        spine.update();
        spine.draw(renderer);
        this._inited = true;
    }
    run(renderer) {
        if (!this._inited) {
            this.init(renderer);
        }
    }
}
exports.default = TestSpine;
//# sourceMappingURL=test-spine.js.map