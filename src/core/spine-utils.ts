import fs = require("fs")
import path = require("path")
import Matrix4 from "../webgl/matrix4"

export default class SpineUtils {
    public static Deg2Radian:number = Math.PI / 180

    public static readJsonFile(file:string){
        let fullPath = path.join(__dirname, "../../res/", file)
        let content = fs.readFileSync(fullPath, "utf8")
        return JSON.parse(content)
    }

    public static transformXYByMatrix(matrix:Matrix4, x:number, y:number) {
        let newX = matrix.getValue(0, 0)*x + matrix.getValue(0, 1)*y + matrix.getValue(0, 3)
        let newY = matrix.getValue(1, 0)*x + matrix.getValue(1, 1)*y + matrix.getValue(1, 3)
        return [newX, newY]
    }

    public static updateTransformFromSRT(transform:Matrix4, rotation:number, scaleX:number, scaleY:number, shearX:number, shearY:number, x:number, y:number){
        transform.identify()
        let rotationX = (rotation + shearX)*SpineUtils.Deg2Radian
        let rotationY = (rotation + shearY)*SpineUtils.Deg2Radian
        transform.setValue(0, 0, Math.cos(rotationX)*scaleX)
        transform.setValue(1, 0, Math.sin(rotationX)*scaleX)
        transform.setValue(0, 1, -Math.sin(rotationY)*scaleY)
        transform.setValue(1, 1, Math.cos(rotationY)*scaleY)
        transform.setTranslate(x, y)
    }
}