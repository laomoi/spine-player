"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spine_1 = require("../core/spine");
const spine_data_1 = require("../core/spine-data");
const spine_utils_1 = require("../core/spine-utils");
const spine_atlas_1 = require("../core/spine-atlas");
class TestSpine {
    constructor() {
        this._inited = false;
        this.spines = [];
    }
    init(renderer) {
        renderer.enableBlend();
        renderer.setAlphaBlendMode();
        let jsonFile = "hero_alva.json";
        let atlasFile = "hero_alva.atlas";
        let pngFile = "hero_alva.png";
        let spineData = new spine_data_1.default();
        spineData.setJson(spine_utils_1.default.readJsonFile(jsonFile));
        let spineAtlas = new spine_atlas_1.default(atlasFile, pngFile, renderer);
        for (let i = 0; i < 1; i++) {
            let spine = new spine_1.default(spineData);
            spine.setAnimation("attack02");
            spine.createMesh(renderer, spineAtlas);
            spine.x = 50 + 2 * i;
            spine.y = 100;
            this.spines.push(spine);
        }
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