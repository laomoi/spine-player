import fs = require("fs")
import path = require("path")
import Matrix4 from "../webgl/matrix4"

export default class SpineUtils {
    public static Deg2Radian:number = Math.PI / 180

    public static readJsonFile(file:string){
        let content = fs.readFileSync(file, "utf8")
        return JSON.parse(content)
    }

    public static transformXYByMatrix(matrix:Matrix4, x:number, y:number) {
        let newX = matrix.getValue(0, 0)*x + matrix.getValue(0, 1)*y + matrix.getValue(0, 3)
        let newY = matrix.getValue(1, 0)*x + matrix.getValue(1, 1)*y + matrix.getValue(1, 3)
        return [newX, newY]
    }

}