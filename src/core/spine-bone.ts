import Matrix4 from "../webgl/matrix4"
import { BoneJson } from "./spine-data"

export default class SpineBone {
    protected json:BoneJson = null
    public worldTransform:Matrix4 = new Matrix4()

    public setJson(json:BoneJson) {
        this.json = json
    }

    public get name():string {
        return this.json.name != null ? this.json.name : ""
    }

    public get length():number {
        return this.json.length != null ? this.json.length : 0
    }

    public get parent():string {
        return this.json.parent != null ? this.json.parent : ""
    }
    
    public get setupX():number {
        return this.json.x != null ? this.json.x : 0
    }

    public get setupY():number {
        return this.json.y != null ? this.json.y : 0
    }

    public get setupRotation():number {
        return this.json.rotation != null ? this.json.rotation : 0
    }

}