import Mesh from "../webgl/mesh";
import Renderer from "../webgl/renderer";
import SpineBone from "./spine-bone";
import SpineData from "./spine-data";
import SpineDebugMesh from "./spine-debug-mesh";
import SpineUtils from "./spine-utils";

export default class Spine {

    protected data:SpineData

    protected animation:string
    protected bones:Array<SpineBone> = []
    protected bonesDict:{[k:string]:SpineBone} = {}

    protected debugMesh:SpineDebugMesh = null
    public showDebugMesh:boolean = true

    protected mesh:Mesh


    public x:number = 0 
    public y:number = 0
    
    public constructor(data:SpineData) {
        this.data = data
        this.createBones()
        this.setupPos()
    }

    protected createBones() {
        for (let b of this.data.json.bones) {
            let bone = new SpineBone()
            bone.setJson(b)
            this.bones.push(bone)
            this.bonesDict[bone.name] = bone
        }
        //根据骨骼的父子关系，计算骨骼更新的先后顺序
        let boneDepthDict:{[k:string]:number} = {}
        for (let bone of this.bones) {
            this.calBoneDepth(bone, boneDepthDict)
        }
        this.bones.sort(function(a:any, b:any){
            return boneDepthDict[a.name] - boneDepthDict[b.name]
        })
    }

    protected calBoneDepth(bone:SpineBone, dict:any) {
        if (dict[bone.name] != null){
            return dict[bone.name]
        }
        if (bone.parent == "") {
            dict[bone.name] = 0
        } else {
            let parentBone = this.bonesDict[bone.parent]
            let parentDepth = this.calBoneDepth(parentBone, dict)
            dict[bone.name] = parentDepth + 1
        }
        return dict[bone.name]
    }

    public getBones():Array<SpineBone> {
        return this.bones
    }

    public setAnimation(animation:string) {
        if (this.data.hasAnimation(animation)){
            this.animation = animation
            this.resetAnimation()
        }
    }

    protected setupPos() {
    }

    protected resetAnimation() {

    }

    public update(){
        //update bones animation
        //update bones world transform
        for (let bone of this.bones){
            let parent = this.bonesDict[bone.parent]
            bone.updateTransform(parent)
            console.log(bone)
        }
    }

    protected updateBoneDebugMesh() {
        
    }

    public draw(renderer:Renderer){
        //update bone-debug-mesh
        //update attached meshes
        //fill vertex buffer

        //draw bone-debug-mesh
        //draw mesh

        if (this.showDebugMesh){
            if (this.debugMesh == null) {
                this.debugMesh = new SpineDebugMesh(renderer)
                this.debugMesh.setSpine(this)
            }
            this.debugMesh.updateFromSpine()
            this.debugMesh.draw()         
        }
    }

}