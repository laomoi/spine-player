"use strict";
exports.__esModule = true;
var renderer_1 = require("./webgl/renderer");
var fs = require("fs");
var path = require("path");
var App = (function () {
    function App() {
    }
    App.prototype.setGL = function (gl) {
        this.gl = gl;
    };
    App.prototype.run = function () {
        console.log("run app");
        var renderer = new renderer_1["default"]();
        renderer.setGL(this.gl);
        console.log(renderer);
        this.test(renderer);
    };
    App.prototype.test = function (renderer) {
        var textureImage = new Image();
        textureImage.onload = function () {
            var vsSource = fs.readFileSync(path.join(__dirname, "../res/shaders/test.vs"), "utf8");
            var fsSource = fs.readFileSync(path.join(__dirname, "../res/shaders/test.fs"), "utf8");
            var shader = renderer.createShader(vsSource, fsSource);
            var vsAttributes = [];
            vsAttributes.push({ location: renderer.getAttrLocation(shader, "a_Position"), size: 3 });
            vsAttributes.push({ location: renderer.getAttrLocation(shader, "a_TexCoord"), size: 2 });
            var vertexs = new Float32Array([
                -1, 1, 0.0, 0.0, 1.0,
                -1, -1, 0.0, 0.0, 0.0,
                1, 1, 0.0, 1.0, 1.0,
                1, -1, 0.0, 1.0, 0.0
            ]);
            var ebo = renderer.createVBO(vertexs, vsAttributes);
            var textureUnit = 0;
            var texture = renderer.createTexture(textureImage, textureUnit);
            renderer.useShader(shader);
            renderer.useTexture(texture, textureUnit);
            renderer.useVBO(ebo);
            renderer.draw(4, false);
        };
        textureImage.src = path.join(__dirname, "../res/test.png");
    };
    return App;
}());
exports["default"] = App;
//# sourceMappingURL=app.js.map