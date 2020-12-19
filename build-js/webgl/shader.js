"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultShader = exports.SHADER_UNIFORM_TYPE = void 0;
const fs = require("fs");
const path = require("path");
var SHADER_UNIFORM_TYPE;
(function (SHADER_UNIFORM_TYPE) {
    SHADER_UNIFORM_TYPE[SHADER_UNIFORM_TYPE["TYPE_1i"] = 1] = "TYPE_1i";
    SHADER_UNIFORM_TYPE[SHADER_UNIFORM_TYPE["TYPE_MATRIX_4F"] = 2] = "TYPE_MATRIX_4F";
})(SHADER_UNIFORM_TYPE = exports.SHADER_UNIFORM_TYPE || (exports.SHADER_UNIFORM_TYPE = {}));
class Shader {
    constructor(renderer) {
        this.renderer = renderer;
    }
    createFromSource(vsSource, fsSource) {
        this.webglShader = this.renderer.createShader(vsSource, fsSource);
    }
    onMeshUseShader(mesh) {
    }
}
exports.default = Shader;
class DefaultShader extends Shader {
    constructor(renderer) {
        super(renderer);
        this.attributes = [];
        let vsSource = fs.readFileSync(path.join(__dirname, "../../res/shaders/default.vs"), "utf8");
        let fsSource = fs.readFileSync(path.join(__dirname, "../../res/shaders/default.fs"), "utf8");
        this.createFromSource(vsSource, fsSource);
        this.onCreated();
    }
    onCreated() {
        this.attributes.push({ location: this.renderer.getAttrLocation(this.webglShader, "a_Position"), size: 2 });
        this.attributes.push({ location: this.renderer.getAttrLocation(this.webglShader, "a_TexCoord"), size: 2 });
    }
    onMeshUseShader(mesh) {
        mesh.setUniform({ name: "u_Sampler", value: 0, type: SHADER_UNIFORM_TYPE.TYPE_1i });
        mesh.setMeshAttributes(this.attributes);
    }
}
exports.DefaultShader = DefaultShader;
//# sourceMappingURL=shader.js.map