import Mesh from "../webgl/mesh";
import Renderer from "../webgl/renderer";
import SpineAnimation from "./spine-animation";
import SpineBone from "./spine-bone";
import SpineData, { AnimationJson } from "./spine-data";
import SpineDebugMesh from "./spine-debug-mesh";
import SpineMesh from "./spine-mesh";
import SpineSlot from "./spine-slot";

export default class Spine {

    protected data:SpineData

    protected bones:Array<SpineBone> = []
    protected bonesDict:{[k:string]:SpineBone} = {}

    protected debugMesh:SpineDebugMesh = null
    public showDebugMesh:boolean = true


    protected mesh:SpineMesh

    protected spineAnimation:SpineAnimation = null

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

    public getBone(name:string):SpineBone {
        return this.bonesDict[name]
    }

    public createMesh(renderer:Renderer, atlas:string, png:string) {
        this.mesh = new SpineMesh(renderer)
        this.mesh.setSpine(this)
        this.mesh.createFromAtlas(atlas, png)
    }

    public getData():SpineData {
        return this.data
    }

    public setAnimation(animationName:string) {
        let animationJson:AnimationJson = this.data.getAnimationData(animationName)
        if (animationJson != null){
            this.spineAnimation = new SpineAnimation(this, animationJson)
        }
    }

    protected setupPos() {
        this.updateBonesTransform()
    }

    public update(){
        if (this.spineAnimation == null) {
            return
        }

        this.spineAnimation.update()
        this.updateBonesTransform()
    }

    protected updateBonesTransform(){
        for (let bone of this.bones){
            let parent = this.bonesDict[bone.parent]
            bone.updateTransform(parent)
        }
    }

    public draw(renderer:Renderer){
        //update bone-debug-mesh
        //update attached meshes
        //fill vertex buffer

        //draw bone-debug-mesh
        //draw mesh

        if (this.mesh) {
            this.mesh.updateFromSpine()
            this.mesh.draw()
        }

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