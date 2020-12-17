"use strict";
exports.__esModule = true;
var test_1 = require("./examples/test");
var renderer_1 = require("./webgl/renderer");
var App = (function () {
    function App() {
        this.showFPSCallback = null;
        this.renderer = null;
        this.test = new test_1["default"]();
    }
    App.prototype.setGL = function (gl, width, height) {
        this.gl = gl;
        this.width = width;
        this.height = height;
    };
    App.prototype.run = function () {
        var _this = this;
        this.renderer = new renderer_1["default"]();
        this.renderer.setGL(this.gl, this.width, this.height);
        var then = 0;
        var lastShowFPS = 0;
        var loopWrap = function (now) {
            now *= 0.001;
            var deltaTime = now - then;
            if (then > 0 && deltaTime > 0 && _this.showFPSCallback != null) {
                if (now - lastShowFPS > 0.3) {
                    var fps = 1 / deltaTime;
                    _this.showFPSCallback(fps);
                    lastShowFPS = now;
                }
            }
            then = now;
            _this.loop();
            requestAnimationFrame(loopWrap);
        };
        loopWrap(0);
    };
    App.prototype.setShowFPSCallback = function (callback) {
        this.showFPSCallback = callback;
    };
    App.prototype.loop = function () {
        this.test.run(this.renderer);
    };
    return App;
}());
exports["default"] = App;
//# sourceMappingURL=app.js.map