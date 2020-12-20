"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class SpineUtils {
    static readJsonFile(file) {
        let content = fs.readFileSync(file, "utf8");
        return JSON.parse(content);
    }
    static transformXYByMatrix(matrix, x, y) {
        let newX = matrix.getValue(0, 0) * x + matrix.getValue(0, 1) * y + matrix.getValue(0, 3);
        let newY = matrix.getValue(1, 0) * x + matrix.getValue(1, 1) * y + matrix.getValue(1, 3);
        return [newX, newY];
    }
}
exports.default = SpineUtils;
SpineUtils.Deg2Radian = Math.PI / 180;
//# sourceMappingURL=spine-utils.js.map