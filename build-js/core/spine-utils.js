"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
class SpineUtils {
    static readJsonFile(file) {
        let fullPath = path.join(__dirname, "../../res/", file);
        let content = fs.readFileSync(fullPath, "utf8");
        return JSON.parse(content);
    }
    static transformXYByMatrix(matrix, x, y) {
        let newX = matrix.getValue(0, 0) * x + matrix.getValue(0, 1) * y + matrix.getValue(0, 3);
        let newY = matrix.getValue(1, 0) * x + matrix.getValue(1, 1) * y + matrix.getValue(1, 3);
        return [newX, newY];
    }
    static updateTransformFromSRT(transform, rotation, scaleX, scaleY, shearX, shearY, x, y) {
        transform.identify();
        let rotationX = (rotation + shearX) * SpineUtils.Deg2Radian;
        let rotationY = (rotation + shearY) * SpineUtils.Deg2Radian;
        transform.setValue(0, 0, Math.cos(rotationX) * scaleX);
        transform.setValue(1, 0, Math.sin(rotationX) * scaleX);
        transform.setValue(0, 1, -Math.sin(rotationY) * scaleY);
        transform.setValue(1, 1, Math.cos(rotationY) * scaleY);
        transform.setTranslate(x, y);
    }
}
exports.default = SpineUtils;
SpineUtils.Deg2Radian = Math.PI / 180;
//# sourceMappingURL=spine-utils.js.map