"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const matrix4_1 = require("./matrix4");
const shader_1 = require("./shader");
class Renderer {
    constructor() {
        this.defaultShader = null;
    }
    setGL(gl, width, height) {
        this.gl = gl;
        this.width = width;
        this.height = height;
        this.matrixProjection = new matrix4_1.default();
        this.matrixProjection.setOrg(width, height);
    }
    clear() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
    createTexture(n, image = null, buffer = null, width = 0, height = 0) {
        let gl = this.gl;
        let texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + n);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        if (buffer) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
        }
        else {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        return texture;
    }
    useTexture(texture, unit) {
        let gl = this.gl;
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, texture);
    }
    createShader(vsSource, fsSource) {
        let gl = this.gl;
        let vertShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertShader, vsSource);
        gl.compileShader(vertShader);
        let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragShader, fsSource);
        gl.compileShader(fragShader);
        let shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertShader);
        gl.attachShader(shaderProgram, fragShader);
        gl.linkProgram(shaderProgram);
        return shaderProgram;
    }
    useShader(shaderProgram, uniforms = null) {
        let gl = this.gl;
        gl.useProgram(shaderProgram);
        if (uniforms != null) {
            for (let u of uniforms) {
                let name = u.name;
                let value = u.value;
                let type = u.type;
                let location = gl.getUniformLocation(shaderProgram, name);
                if (location != null) {
                    if (type == shader_1.SHADER_UNIFORM_TYPE.TYPE_1i) {
                        gl.uniform1i(location, value);
                    }
                    else if (type == shader_1.SHADER_UNIFORM_TYPE.TYPE_MATRIX_4F) {
                        gl.uniformMatrix4fv(location, false, value);
                    }
                    else {
                        console.log("not supporting uniform type");
                    }
                }
            }
        }
        let pLocation = gl.getUniformLocation(shaderProgram, "P");
        if (pLocation) {
            gl.uniformMatrix4fv(pLocation, false, this.matrixProjection.value);
        }
    }
    getAttrLocation(shaderProgram, name) {
        let gl = this.gl;
        return gl.getAttribLocation(shaderProgram, name);
    }
    createVBO(vertices) {
        let gl = this.gl;
        let vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
        return vbo;
    }
    updateVBO(vbo, vertexs) {
        let gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, vertexs, gl.DYNAMIC_DRAW);
    }
    useVBO(vbo, bytesPerVertex, attributes) {
        let gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        let offset = 0;
        let floatSize = Float32Array.BYTES_PER_ELEMENT;
        for (let i = 0; i < attributes.length; i++) {
            let attrib = attributes[i];
            let location = attrib.location;
            let sizeOfAttrib = attrib.size;
            gl.enableVertexAttribArray(location);
            gl.vertexAttribPointer(location, sizeOfAttrib, gl.FLOAT, false, bytesPerVertex, offset * floatSize);
            offset += sizeOfAttrib;
        }
    }
    createEBO(indices) {
        let gl = this.gl;
        let ebo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.DYNAMIC_DRAW);
        return ebo;
    }
    useEBO(ebo = null) {
        let gl = this.gl;
        if (ebo) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
        }
    }
    draw(vertexCount, usingEBO = true) {
        let gl = this.gl;
        if (usingEBO) {
            gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_SHORT, 0);
        }
        else {
            gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
        }
    }
    setBlendMode(srcBlend, dstBlend) {
        let gl = this.gl;
        gl.blendFunc(srcBlend, dstBlend);
    }
    setAlphaBlendMode() {
        let gl = this.gl;
        this.setBlendMode(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }
    enableBlend() {
        this.gl.enable(this.gl.BLEND);
    }
    getDefaultShader() {
        if (this.defaultShader == null) {
            this.defaultShader = new shader_1.DefaultShader(this);
        }
        return this.defaultShader;
    }
}
exports.default = Renderer;
//# sourceMappingURL=renderer.js.map