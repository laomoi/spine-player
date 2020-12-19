"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultShader = void 0;
const renderer_1 = require("./renderer");
const fs = require("fs");
const path = require("path");
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
        mesh.setUniform({ name: "u_Sampler", value: 0, type: renderer_1.SHADER_UNIFORM_TYPE.TYPE_1i });
        mesh.setMeshAttributes(this.attributes);
    }
}
exports.DefaultShader = DefaultShader;
//# sourceMappingURL=shader.js.map