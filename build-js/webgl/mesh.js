"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const texture_1 = require("./texture");
class Mesh {
    constructor(renderer) {
        this.points = [];
        this.indices = null;
        this.attributes = [];
        this.uniforms = [];
        this._x = 0;
        this._y = 0;
        this.vertsDirty = true;
        this.vertsIndexDirty = true;
        this.vbo = null;
        this.ebo = null;
        this.renderer = renderer;
        this.setShader(this.renderer.getDefaultShader());
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    set x(x) {
        this._x = x;
        this.vertsDirty = true;
    }
    set y(y) {
        this._y = y;
        this.vertsDirty = true;
    }
    setImage(file) {
        this.texture = texture_1.default.getTexture(file, this.renderer);
        this.vertsDirty = true;
    }
    setTexture(texture) {
        this.texture = texture;
        this.vertsDirty = true;
    }
    setShader(shader) {
        this.shader = shader;
        this.shader.onMeshUseShader(this);
    }
    setUniform(uniform) {
        for (let i = 0; i < this.uniforms.length; i++) {
            if (this.uniforms[i].name == uniform.name) {
                this.uniforms.splice(i, 1);
                break;
            }
        }
        this.uniforms.push(uniform);
    }
    setMeshAttributes(attributes) {
        this.attributes = attributes;
        let bytesPerVertex = 0;
        let elementsCountPerVertex = 0;
        for (let i = 0; i < attributes.length; i++) {
            let attrib = attributes[i];
            let sizeOfAttrib = attrib.size;
            bytesPerVertex += sizeOfAttrib * Float32Array.BYTES_PER_ELEMENT;
            elementsCountPerVertex += sizeOfAttrib;
        }
        this.bytesPerVertex = bytesPerVertex;
        this.elementsCountPerVertex = elementsCountPerVertex;
    }
    updateVertices() {
        if (this.vertices == null || this.vertices.length != this.points.length * this.elementsCountPerVertex) {
            this.vertices = new Float32Array(this.points.length * this.elementsCountPerVertex);
        }
        for (let p = 0; p < this.points.length; p++) {
            this.vertices[p * 4] = this.points[p][0] + this.x;
            this.vertices[p * 4 + 1] = this.points[p][1] + this.y;
            this.vertices[p * 4 + 2] = this.points[p][2];
            this.vertices[p * 4 + 3] = this.points[p][3];
        }
        if (this.vbo == null) {
            this.vbo = this.renderer.createVBO(this.vertices);
        }
        else {
            this.renderer.updateVBO(this.vbo, this.vertices);
        }
        this.vertsDirty = false;
    }
    updateVerticesIndex() {
        if (this.ebo == null) {
            this.ebo = this.renderer.createEBO(this.indices);
        }
        else {
            this.renderer.updateEBO(this.ebo, this.indices);
        }
        this.vertsIndexDirty = false;
    }
    preDraw() {
    }
    fillBuffers() {
        if (this.vertsDirty) {
            this.updateVertices();
        }
        if (this.vertsIndexDirty) {
            this.updateVerticesIndex();
        }
    }
    draw() {
        this.preDraw();
        this.fillBuffers();
        this.useShader();
        this.useTexture();
        this.useVBO();
        this.useEBO();
        this.renderer.draw(this.indices.length, true);
    }
    useShader() {
        this.renderer.useShader(this.shader.webglShader, this.uniforms);
    }
    useTexture() {
        this.renderer.useTexture(this.texture.webglTexture, 0);
    }
    useVBO() {
        this.renderer.useVBO(this.vbo, this.bytesPerVertex, this.attributes);
    }
    useEBO() {
        this.renderer.useEBO(this.ebo);
    }
    setVertsDiry() {
        this.vertsDirty = true;
    }
    setVertsIndexDiry() {
        this.vertsIndexDirty = true;
    }
}
exports.default = Mesh;
//# sourceMappingURL=mesh.js.map