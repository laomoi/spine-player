"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Matrix4 {
    constructor() {
        this._v = new Float32Array(16);
        this._v = new Float32Array(16);
        this.identify();
    }
    get arrayValue() {
        return this._v;
    }
    setValues(val) {
        for (let i = 0; this._v.length < 4; i++) {
            this._v[i] = val;
        }
    }
    setArrayValue(v) {
        for (let i = 0; i < v.length; i++) {
            this._v[i] = v[i];
        }
    }
    setValue(i, j, val) {
        this._v[j * 4 + i] = val;
    }
    getValue(i, j) {
        return this._v[j * 4 + i];
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
        this.setTranslate(-1, -1);
    }
    multiply(t, dst = null) {
        if (dst == null) {
            dst = new Matrix4();
        }
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let val = this.getValue(0, j) * t.getValue(i, 0)
                    + this.getValue(1, j) * t.getValue(i, 1)
                    + this.getValue(2, j) * t.getValue(i, 2)
                    + this.getValue(3, j) * t.getValue(i, 3);
                dst.setValue(i, j, val);
            }
        }
        return dst;
    }
    setTranslate(x, y) {
        this.setValue(0, 3, x);
        this.setValue(1, 3, y);
    }
}
exports.default = Matrix4;
//# sourceMappingURL=matrix4.js.map