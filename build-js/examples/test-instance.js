"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceShader = void 0;
const fs = require("fs");
const path = require("path");
const shader_1 = require("../webgl/shader");
const spine_1 = require("../core/spine");
const spine_atlas_1 = require("../core/spine-atlas");
const spine_data_1 = require("../core/spine-data");
const spine_utils_1 = require("../core/spine-utils");
class InstanceShader extends shader_1.default {
    constructor(renderer) {
        super(renderer);
        this.attributes = [];
        let vsSource = fs.readFileSync(path.join(__dirname, "../../res/shaders/instancing.vs"), "utf8");
        let fsSource = fs.readFileSync(path.join(__dirname, "../../res/shaders/instancing.fs"), "utf8");
        this.createFromSource(vsSource, fsSource);
        this.onCreated();
    }
    onCreated() {
        this.attributes.push({ location: this.queryLocOfAttr("a_Position"), size: 2 });
        this.attributes.push({ location: this.queryLocOfAttr("a_TexCoord"), size: 2 });
    }
    onMeshUseShader(mesh) {
        mesh.setUniform({ name: "u_Sampler", value: 0, type: shader_1.SHADER_UNIFORM_TYPE.TYPE_1i });
        mesh.setMeshAttributes(this.attributes);
    }
}
exports.InstanceShader = InstanceShader;
class TestInstance {
    constructor() {
        this._inited = false;
        this.meshes = [];
        this.paused = false;
        this.positions = [];
        this.positionsArray = null;
        this.instanceCount = 1000;
    }
    init(renderer) {
        this._inited = true;
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
        this.mesh = spine.createMesh(renderer, spineAtlas);
        this.spine = spine;
        let ext = renderer.getExtension("ANGLE_instanced_arrays");
        if (!ext) {
            console.error('need ANGLE_instanced_arrays');
            return;
        }
        this.ext = ext;
        for (let i = 0; i < this.instanceCount; i++) {
            this.positions.push(100 + Math.random() * 700);
            this.positions.push(100 + Math.random() * 500);
        }
        this.positionsArray = new Float32Array(this.positions);
        this.positionBuffer = renderer.createVBO(this.positionsArray);
        let shader = new InstanceShader(renderer);
        this.mesh.setShader(shader);
        this.positionsLoc = shader.queryLocOfAttr("a_Position_instancing");
    }
    run(renderer) {
        if (!this._inited) {
            this.init(renderer);
        }
        if (!this.paused) {
            this.update(renderer);
        }
    }
    update(renderer) {
        renderer.clear();
        this.spine.update();
        let gl = renderer.getGL();
        this.mesh.preDraw();
        this.mesh.fillBuffers();
        this.mesh.useShader();
        this.mesh.useTexture();
        this.mesh.useVBO();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.enableVertexAttribArray(this.positionsLoc);
        gl.vertexAttribPointer(this.positionsLoc, 2, gl.FLOAT, false, 0, 0);
        this.ext.vertexAttribDivisorANGLE(this.positionsLoc, 1);
        this.mesh.useEBO();
        this.ext.drawElementsInstancedANGLE(gl.TRIANGLES, this.mesh.indices.length, gl.UNSIGNED_SHORT, 0, this.instanceCount);
    }
}
exports.default = TestInstance;
//# sourceMappingURL=test-instance.js.map