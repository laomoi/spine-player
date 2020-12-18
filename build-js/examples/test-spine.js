"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const spine_1 = require("../core/spine");
class TestSpine {
    constructor() {
        this._inited = false;
        this.spines = [];
    }
    init(renderer) {
        renderer.enableBlend();
        renderer.setAlphaBlendMode();
        let spine = new spine_1.default(path.join(__dirname, "../../res/skeleton.json"), "", "");
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