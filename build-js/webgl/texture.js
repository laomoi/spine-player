"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
let decode = require('image-decode');
class Texture {
    constructor(file, renderer) {
        let { data, width, height } = decode(fs.readFileSync(path.join(__dirname, "../../res/" + file)));
        this.imageWidth = width;
        this.imageHeight = height;
        this.imageData = data;
        this.webglTexture = renderer.createTexture(0, null, data, width, height);
    }
    static getTexture(file, renderer) {
        if (Texture.cache[file]) {
            return Texture.cache[file];
        }
        Texture.cache[file] = new Texture(file, renderer);
        return Texture.cache[file];
    }
}
exports.default = Texture;
Texture.cache = {};
//# sourceMappingURL=texture.js.map