import Mesh from "../webgl/mesh";
import Renderer from "../webgl/renderer";
import SpineAnimation from "./spine-animation";
import SpineAtlas from "./spine-atlas";
import SpineBone from "./spine-bone";
import SpineData, { AnimationJson } from "./spine-data";
import SpineDebugMesh from "./spine-debug-mesh";
import SpineMesh from "./spine-mesh";


export interface ISpineMesh {
    updateFromSpine():void,
    draw():void,
}

export default class Spine {

    protected data:SpineData

    protected bones:Array<SpineBone> = []
    protected sortedBones:Array<SpineBone> = []
    protected bonesDict:{[k:string]:SpineBone} = {}

    protected meshes:Array<ISpineMesh> = []

    protected spineAnimation:SpineAnimation = null

    public x:number = 0 
    public y:number = 0
    

    public constructor(data:SpineData) {
        this.data = data
        this.createBones()
        this.setupBones()
    }

    protected createBones() {
        for (let b of this.data.json.bones) {
            let bone = new SpineBone()
            bone.setJson(b)
            this.bones.push(bone)
            this.sortedBones.push(bone)
            this.bonesDict[bone.name] = bone
        }
        //根据骨骼的父子关系，计算骨骼更新的先后顺序
        let boneDepthDict:{[k:string]:number} = {}
        for (let bone of this.bones) {
            this.calBoneDepth(bone, boneDepthDict)
        }
        this.sortedBones.sort(function(a:any, b:any){
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

    public getSortedBones():Array<SpineBone> {
        return this.sortedBones
    }

    public getBone(name:string):SpineBone {
        return this.bonesDict[name]
    }

    public createMesh(renderer:Renderer, atlas:SpineAtlas) {
        let mesh = new SpineMesh(renderer)
        mesh.setSpine(this)
        mesh.createFromAtlas(atlas)
        this.meshes.push(mesh)
    }

    public createDebugMesh(renderer:Renderer) {
        let mesh = new SpineDebugMesh(renderer)
        mesh.setSpine(this)
        this.meshes.unshift(mesh)
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

    protected setupBones() {
        this.updateBonesTransform()
    }

    public getAnimation():SpineAnimation {
        return this.spineAnimation
    }

    public update(){
        if (this.spineAnimation == null) {
            return
        }

        this.spineAnimation.update()
        this.updateBonesTransform()
    }

    protected updateBonesTransform(){
        for (let bone of this.sortedBones){
            let parent = this.bonesDict[bone.parent]
            bone.updateTransform(parent)
        }
    }

    public draw(renderer:Renderer){
        for (let mesh of this.meshes) {
            mesh.updateFromSpine()
            mesh.draw()
        }
    }

}