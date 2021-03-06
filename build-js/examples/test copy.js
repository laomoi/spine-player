"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mesh_1 = require("../webgl/mesh");
const fs = require("fs");
const path = require("path");
class Test {
    constructor() {
        this._inited = false;
        this.meshes = [];
    }
    init(renderer) {
        let vsSource = fs.readFileSync(path.join(__dirname, "../../res/shaders/test.vs"), "utf8");
        let fsSource = fs.readFileSync(path.join(__dirname, "../../res/shaders/test.fs"), "utf8");
        let shader = renderer.createShader(vsSource, fsSource);
        let attributes = [];
        attributes.push({ location: renderer.getAttrLocation(shader, "a_Position"), size: 2 });
        attributes.push({ location: renderer.getAttrLocation(shader, "a_TexCoord"), size: 2 });
        let sprite1 = new mesh_1.Sprite(renderer);
        sprite1.setImage("test.png");
        sprite1.setShader(shader);
        sprite1.setMeshAttributes(attributes);
        sprite1.x = 100;
        sprite1.y = 100;
        this.meshes.push(sprite1);
        let sprite2 = new mesh_1.Sprite(renderer);
        sprite2.setImage("test2.png");
        sprite2.setShader(shader);
        sprite2.setMeshAttributes(attributes);
        sprite2.x = 200;
        sprite2.y = 200;
        this.meshes.push(sprite2);
        this._inited = true;
    }
    run(renderer) {
        if (!this._inited) {
            this.init(renderer);
        }
        renderer.clear();
        for (let mesh of this.meshes) {
            mesh.x += 1;
            if (mesh.x >= 400) {
                mesh.x = 0;
            }
        }
        for (let mesh of this.meshes) {
            mesh.draw();
        }
    }
}
exports.default = Test;
//# sourceMappingURL=test%20copy.js.map