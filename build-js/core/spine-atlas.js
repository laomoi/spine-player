"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtlasRegion = void 0;
const texture_1 = require("../webgl/texture");
const fs = require("fs");
const path = require("path");
class AtlasRegion {
}
exports.AtlasRegion = AtlasRegion;
class SpineAtlas {
    constructor(atlas, png, renderer) {
        this.atlasInfo = {};
        this.regions = {};
        this.texture = texture_1.default.getTexture(png, renderer);
        let atlasContent = fs.readFileSync(path.join(__dirname, "../../res/" + atlas), "utf8");
        this.parseAtlas(atlasContent);
    }
    parseAtlas(content) {
        let lines = content.split(/\r\n|\n/);
        let regPng = /^(.*?\.png)/;
        let regFrameName = /^([^:]+)$/;
        let headerKvReg = /^(\w+)\:\s*(.*)/;
        let kvReg = /\s+(\w+)\:\s*(.*)/;
        let doubleValueReg = /^(.*?),\s*(.*)/;
        let info = {};
        let lastFrameName = "";
        for (let line of lines) {
            if (info.png == null) {
                let matches = line.match(regPng);
                if (matches && matches.length > 0) {
                    info['png'] = matches[1];
                    info['frames'] = {};
                }
            }
            else {
                let matches = line.match(headerKvReg);
                if (matches && matches.length > 0) {
                    let k = matches[1];
                    let v = matches[2];
                    let vmatches = v.match(doubleValueReg);
                    if (vmatches && vmatches.length > 0) {
                        if (k != "format") {
                            info[k] = [parseFloat(vmatches[1]), parseFloat(vmatches[2])];
                        }
                        else {
                            info[k] = [vmatches[1], vmatches[2]];
                        }
                    }
                    else {
                        info[k] = v;
                    }
                    continue;
                }
                matches = line.match(regFrameName);
                if (matches && matches.length > 0) {
                    lastFrameName = matches[1];
                    info['frames'][lastFrameName] = {};
                    continue;
                }
                matches = line.match(kvReg);
                if (matches && matches.length > 0) {
                    let k = matches[1];
                    let v = matches[2];
                    let vmatches = v.match(doubleValueReg);
                    if (vmatches && vmatches.length > 0) {
                        info['frames'][lastFrameName][k] = [parseFloat(vmatches[1]), parseFloat(vmatches[2])];
                    }
                    else {
                        info['frames'][lastFrameName][k] = v;
                    }
                    continue;
                }
            }
        }
        this.atlasInfo = info;
        this.createRegions();
    }
    createRegions() {
        let width = this.atlasInfo.size[0];
        let height = this.atlasInfo.size[1];
        for (let frameName in this.atlasInfo.frames) {
            let frame = this.atlasInfo.frames[frameName];
            let region = new AtlasRegion();
            this.regions[frameName] = region;
            region.name = frameName;
            region.x = frame.xy[0];
            region.y = frame.xy[1];
            region.width = frame.size[0];
            region.height = frame.size[1];
            region.originalWidth = frame.orig[0];
            region.originalHeight = frame.orig[1];
            region.offsetX = frame.offset[0];
            region.offsetY = frame.offset[1];
            region.u1 = region.x / width;
            region.v1 = region.y / height;
            region.u2 = (region.x + region.width) / width;
            region.v2 = (region.y + region.height) / height;
            region.uLen = region.u2 - region.u1;
            region.vLen = region.v2 - region.v1;
        }
        console.log(this.regions);
    }
    getRegion(name) {
        return this.regions[name];
    }
}
exports.default = SpineAtlas;
//# sourceMappingURL=spine-atlas.js.map