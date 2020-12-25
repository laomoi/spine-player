"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spine_1 = require("../core/spine");
const spine_data_1 = require("../core/spine-data");
const spine_utils_1 = require("../core/spine-utils");
const spine_atlas_1 = require("../core/spine-atlas");
const sprite_1 = require("../webgl/sprite");
class TestSpine {
    constructor() {
        this._inited = false;
        this.spines = [];
    }
    init(renderer) {
        renderer.enableBlend();
        renderer.setAlphaBlendMode();
        let jsonFile = "skeleton.json";
        let atlasFile = "skeleton.atlas";
        let pngFile = "skeleton.png";
        let spineData = new spine_data_1.default();
        spineData.setJson(spine_utils_1.default.readJsonFile(jsonFile));
        let spineAtlas = new spine_atlas_1.default(atlasFile, pngFile, renderer);
        let sprite1 = new sprite_1.default(renderer);
        sprite1.setImage("test.png");
        sprite1.x = 50;
        sprite1.y = -200;
        this.sprite = sprite1;
        for (let i = 0; i < 1; i++) {
            let spine = new spine_1.default(spineData);
            spine.setAnimation("animation");
            spine.createMesh(renderer, spineAtlas);
            spine.createDebugMesh(renderer);
            spine.x = 150 + 2 * i;
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
        this.sprite.draw();
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