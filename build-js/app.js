"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_spine_1 = require("./examples/test-spine");
const renderer_1 = require("./webgl/renderer");
class App {
    constructor() {
        this.webCallback = null;
        this.renderer = null;
        this.test = new test_spine_1.default();
    }
    setGL(gl, width, height) {
        this.gl = gl;
        this.width = width;
        this.height = height;
    }
    run() {
        this.renderer = new renderer_1.default();
        this.renderer.setGL(this.gl, this.width, this.height);
        let then = 0;
        let lastShowFPS = 0;
        let loopWrap = (now) => {
            now *= 0.001;
            const deltaTime = now - then;
            if (then > 0 && deltaTime > 0 && this.webCallback != null) {
                if (now - lastShowFPS > 0.3) {
                    const fps = 1 / deltaTime;
                    this.webCallback("fps", fps);
                    lastShowFPS = now;
                }
            }
            then = now;
            this.loop();
            requestAnimationFrame(loopWrap);
        };
        loopWrap(0);
    }
    setCallback(callback) {
        this.webCallback = callback;
    }
    loop() {
        this.test.run(this.renderer);
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map