"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Matrix4 {
    constructor() {
        this._v = new Float32Array(16);
        this._v = new Float32Array(16);
        this.identify();
    }
    get value() {
        return this._v;
    }
    setValues(val) {
        for (let i = 0; this._v.length < 4; i++) {
            this._v[i] = val;
        }
    }
    setValue(i, j, val) {
        this._v[j * 4 + i] = val;
    }
    identify() {
        this.setValues(0);
        this.setValue(0, 0, 1);
        this.setValue(1, 1, 1);
        this.setValue(2, 2, 1);
        this.setValue(3, 3, 1);
    }
    setOrg(width, height) {
        this.setValue(0, 0, 2 / width);
        this.setValue(1, 1, 2 / height);
        this.setValue(0, 3, -1);
        this.setValue(1, 3, -1);
    }
}
exports.default = Matrix4;
//# sourceMappingURL=matrix4.js.map