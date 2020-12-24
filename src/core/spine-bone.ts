import Matrix4 from "../webgl/matrix4"
import { BoneJson } from "./spine-data"
import SpineUtils from "./spine-utils"

interface BoneSetupPos {
    x:number,
    y:number,
    rotation:number,
    shearX:number,
    shearY:number,
    scaleX:number,
    scaleY:number,
}
export default class SpineBone {
    protected json:BoneJson = null
    public worldTransform:Matrix4 = new Matrix4()
    protected localTransform:Matrix4 = new Matrix4()
    public setupPosValue:BoneSetupPos

    public name:string
    public length:number
    public parent:string
    public x:number
    public y:number
    public rotation:number
    public shearX:number
    public shearY:number
    public scaleX:number
    public scaleY:number

    public setJson(json:BoneJson) {
        this.json = json
        this.name = json.name
        this.length = json.length  != null ? json.length : 0
        this.parent = json.parent  != null ? json.parent : ""
        this.setupPosValue = {
            x : json.x != null ? json.x : 0,
            y : json.y != null ? json.y : 0,
            rotation: json.rotation != null ? json.rotation : 0,
            shearX: json.shearX != null ? json.shearX : 0,
            shearY: json.shearY != null ? json.shearY : 0,
            scaleX: json.scaleX != null ? json.scaleX : 1,
            scaleY: json.scaleY != null ? json.scaleY : 1
        }
        this.setupPos()
    }

    protected setupPos(){
        this.x = this.setupPosValue.x
        this.y = this.setupPosValue.y
        this.rotation = this.setupPosValue.rotation
        this.shearX = this.setupPosValue.shearX
        this.shearY = this.setupPosValue.shearY
        this.scaleX = this.setupPosValue.scaleX
        this.scaleY = this.setupPosValue.scaleY
    }

    public updateTransform(parent:SpineBone){
        SpineUtils.updateTransformFromSRT(this.localTransform, this.rotation, this.scaleX,  this.scaleY, 
            this.shearX, this.shearY, this.x, this.y)
        if (parent) {
            this.localTransform.multiply(parent.worldTransform, this.worldTransform)
        } else {
            this.worldTransform.setArrayValue(this.localTransform.arrayValue)
        }
    }
}