"use strict";
exports.__esModule = true;
var Renderer = (function () {
    function Renderer() {
    }
    Renderer.prototype.setGL = function (gl) {
        this.gl = gl;
    };
    Renderer.prototype.createTexture = function (n, image, buffer, width, height) {
        if (image === void 0) { image = null; }
        if (buffer === void 0) { buffer = null; }
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        var gl = this.gl;
        var texture = gl.createTexture();
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
    };
    Renderer.prototype.useTexture = function (texture, n) {
        var gl = this.gl;
        gl.activeTexture(gl.TEXTURE0 + n);
        gl.bindTexture(gl.TEXTURE_2D, texture);
    };
    Renderer.prototype.createShader = function (vsSource, fsSource) {
        var gl = this.gl;
        var vertShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertShader, vsSource);
        gl.compileShader(vertShader);
        var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragShader, fsSource);
        gl.compileShader(fragShader);
        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertShader);
        gl.attachShader(shaderProgram, fragShader);
        gl.linkProgram(shaderProgram);
        return shaderProgram;
    };
    Renderer.prototype.useShader = function (shaderProgram, uniforms) {
        if (uniforms === void 0) { uniforms = null; }
        var gl = this.gl;
        gl.useProgram(shaderProgram);
        if (uniforms != null) {
            for (var _i = 0, uniforms_1 = uniforms; _i < uniforms_1.length; _i++) {
                var u = uniforms_1[_i];
                var name_1 = u.name;
                var value = u.value;
                var type = u.type;
                var location_1 = gl.getUniformLocation(shaderProgram, name_1);
                if (location_1 != null) {
                    if (type == "1i") {
                        gl.uniform1i(location_1, value);
                    }
                    else {
                        console.log("not supporting uniform type");
                    }
                }
            }
        }
    };
    Renderer.prototype.getAttrLocation = function (shaderProgram, name) {
        var gl = this.gl;
        return gl.getAttribLocation(shaderProgram, name);
    };
    Renderer.prototype.createVBO = function (vertices, attributes) {
        if (attributes === void 0) { attributes = []; }
        var gl = this.gl;
        var vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
        var offset = 0;
        var floatSize = vertices.BYTES_PER_ELEMENT;
        var vertexSize = 0;
        for (var i = 0; i < attributes.length; i++) {
            var attrib = attributes[i];
            var sizeOfAttrib = attrib.size;
            vertexSize += sizeOfAttrib * floatSize;
        }
        for (var i = 0; i < attributes.length; i++) {
            var attrib = attributes[i];
            var location_2 = attrib.location;
            var sizeOfAttrib = attrib.size;
            gl.enableVertexAttribArray(location_2);
            gl.vertexAttribPointer(location_2, sizeOfAttrib, gl.FLOAT, false, vertexSize, offset * floatSize);
            offset += sizeOfAttrib;
        }
        return vbo;
    };
    Renderer.prototype.updateVBO = function (vbo, vertexs) {
        var gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, vertexs, gl.DYNAMIC_DRAW);
    };
    Renderer.prototype.createEBO = function (indices) {
        var gl = this.gl;
        var ebo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.DYNAMIC_DRAW);
        return ebo;
    };
    Renderer.prototype.useVBO = function (vbo, ebo) {
        if (ebo === void 0) { ebo = null; }
        var gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        if (ebo) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
        }
    };
    Renderer.prototype.draw = function (vertexCount, usingEBO) {
        if (usingEBO === void 0) { usingEBO = true; }
        var gl = this.gl;
        if (usingEBO) {
            gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_SHORT, 0);
        }
        else {
            gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
        }
    };
    return Renderer;
}());
exports["default"] = Renderer;
//# sourceMappingURL=renderer.js.map