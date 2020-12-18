"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class SpineUtils {
    static readJsonFile(file) {
        let content = fs.readFileSync(file, "utf8");
        return JSON.parse(content);
    }
}
exports.default = SpineUtils;
//# sourceMappingURL=spine-utils.js.map