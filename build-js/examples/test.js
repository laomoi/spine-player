"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var decode = require('image-decode');
var Test = (function () {
    function Test() {
        this._inited = false;
        this.verticesCount = 0;
        this.textureUnit = 0;
        this.vbo = null;
        this.ebo = null;
    }
    Test.prototype.init = function (renderer) {
        var _a = decode(fs.readFileSync(path.join(__dirname, "../../res/test.png"))), data = _a.data, width = _a.width, height = _a.height;
        var vsSource = fs.readFileSync(path.join(__dirname, "../../res/shaders/test.vs"), "utf8");
        var fsSource = fs.readFileSync(path.join(__dirname, "../../res/shaders/test.fs"), "utf8");
        var shader = renderer.createShader(vsSource, fsSource);
        var vsAttributes = [];
        vsAttributes.push({ location: renderer.getAttrLocation(shader, "a_Position"), size: 2 });
        vsAttributes.push({ location: renderer.getAttrLocation(shader, "a_TexCoord"), size: 2 });
        var vertices = new Float32Array([
            -1, 1, 0.0, 1.0,
            -1, -1, 0.0, 0.0,
            1, 1, 1.0, 1.0,
            1, -1, 1.0, 0.0
        ]);
        var indices = new Uint16Array([
            0, 1, 2,
            1, 3, 2
        ]);
        this.verticesCount = indices.length;
        this.vbo = renderer.createVBO(vertices, vsAttributes);
        this.ebo = renderer.createEBO(indices);
        var texture = renderer.createTexture(this.textureUnit, null, data, width, height);
        renderer.useShader(shader);
        renderer.useTexture(texture, this.textureUnit);
        renderer.useVBO(this.vbo, this.ebo);
        this._inited = true;
    };
    Test.prototype.run = function (renderer) {
        if (!this._inited) {
            this.init(renderer);
        }
        renderer.draw(this.verticesCount, true);
    };
    return Test;
}());
exports["default"] = Test;
//# sourceMappingURL=test.js.map