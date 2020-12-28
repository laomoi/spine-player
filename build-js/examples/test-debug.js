"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spine_1 = require("../core/spine");
const spine_atlas_1 = require("../core/spine-atlas");
const spine_data_1 = require("../core/spine-data");
const spine_utils_1 = require("../core/spine-utils");
class TestDebug {
    constructor() {
        this._inited = false;
        this.meshes = [];
        this.spines = [];
        this.paused = false;
    }
    init(renderer) {
        renderer.enableBlend();
        renderer.setAlphaBlendMode();
        let jsonFile = "sp_shuicao.json";
        let atlasFile = "sp_shuicao.atlas";
        let pngFile = "sp_shuicao.png";
        let spineData = new spine_data_1.default();
        spineData.setJson(spine_utils_1.default.readJsonFile(jsonFile));
        let spineAtlas = new spine_atlas_1.default(atlasFile, pngFile, renderer);
        let spine = new spine_1.default(spineData);
        spine.setAnimation("animation");
        spine.createMesh(renderer, spineAtlas);
        spine.createDebugMesh(renderer);
        spine.x = 100 + Math.random() * 700;
        spine.y = 100 + Math.random() * 500;
        this.testSpine = spine;
        this._inited = true;
        this.addDebugUI(renderer);
    }
    run(renderer) {
        if (!this._inited) {
            this.init(renderer);
        }
        if (!this.paused) {
            renderer.clear();
            this.testSpine.update();
            this.testSpine.draw(renderer);
        }
        if (this.testSpine.getAnimation()) {
            this.debugLabel.innerHTML = this.testSpine.getAnimation().getCurrentTime().toFixed(3);
        }
    }
    addDebugUI(renderer) {
        let self = this;
        let debugElement = document.getElementById("debug");
        let button = document.createElement("Button");
        button.innerHTML = "单帧调试";
        let button2 = document.createElement("Button");
        button2.innerHTML = "暂停";
        let label = document.createElement("span");
        button.onclick = function () {
            renderer.clear();
            self.testSpine.update();
            self.testSpine.draw(renderer);
        };
        button2.onclick = function () {
            self.paused = true;
        };
        debugElement.append(button);
        debugElement.append(button2);
        debugElement.append(label);
        this.debugLabel = label;
    }
}
exports.default = TestDebug;
//# sourceMappingURL=test-debug.js.map