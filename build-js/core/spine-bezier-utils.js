"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SpineBezierUtils {
    static getBezierTable(segCount = 10) {
        if (SpineBezierUtils.curveSampleTable[segCount] == null) {
            SpineBezierUtils.curveSampleTable[segCount] = [];
            let table = SpineBezierUtils.curveSampleTable[segCount];
            let dt = 1 / segCount;
            for (let i = 1; i < segCount; i++) {
                let t = i * dt;
                let factor0 = (1 - t) * (1 - t) * (1 - t);
                let factor1 = 3 * (1 - t) * (1 - t) * t;
                let factor2 = 3 * (1 - t) * t * t;
                let factor3 = t * t * t;
                table.push([factor0, factor1, factor2, factor3]);
            }
        }
        return SpineBezierUtils.curveSampleTable[segCount];
    }
    static splitCurveToSamples(points, size = 10) {
        let curveTable = SpineBezierUtils.getBezierTable(size);
        let count = curveTable.length + 1;
        let curveSamples = [];
        let p0x = 0, p0y = 0;
        let p1x = points[0], p1y = points[1];
        let p2x = points[2], p2y = points[3];
        let p3x = 1, p3y = 1;
        for (let i = 1; i < count; i++) {
            let factor0 = curveTable[i - 1][0];
            let factor1 = curveTable[i - 1][1];
            let factor2 = curveTable[i - 1][2];
            let factor3 = curveTable[i - 1][3];
            let ftx = factor0 * p0x + factor1 * p1x + factor2 * p2x + factor3 * p3x;
            let fty = factor0 * p0y + factor1 * p1y + factor2 * p2y + factor3 * p3y;
            curveSamples[(i - 1) * 2] = ftx;
            curveSamples[(i - 1) * 2 + 1] = fty;
        }
        curveSamples.unshift(p0x, p0y);
        curveSamples.push(p3x, p3y);
        return curveSamples;
    }
    static getInterValue(curveSamples, t, startValue, endValue) {
        let samplesCount = curveSamples.length;
        if (t <= 0) {
            return startValue;
        }
        if (t >= 1) {
            return endValue;
        }
        for (let i = 2; i < samplesCount; i += 2) {
            let t1 = curveSamples[i - 2];
            let t2 = curveSamples[i];
            if (t1 <= t && t <= t2) {
                let percent = (t - t1) / (t2 - t1);
                let y1 = curveSamples[i - 1];
                let y2 = curveSamples[i + 1];
                let y = y1 * (1 - percent) + y2 * percent;
                return startValue + y * (endValue - startValue);
            }
        }
        return endValue;
    }
}
exports.default = SpineBezierUtils;
SpineBezierUtils.curveSampleTable = {};
//# sourceMappingURL=spine-bezier-utils.js.map