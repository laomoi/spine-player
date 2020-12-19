import Mesh from "../webgl/mesh";
import Renderer from "../webgl/renderer";
import SpineBone from "./spine-bone";
import SpineData from "./spine-data";
import SpineUtils from "./spine-utils";

export default class Spine {

    protected data:SpineData

    protected animation:string
    protected bones:Array<SpineBone> = []
    protected bonesDict:{[k:string]:SpineBone} = {}

    protected boneDebugMesh:Mesh = null

    protected mesh:Mesh

    public showDebugBone:boolean = true
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
     
    }

    protected updateBoneDebugMesh() {
        
    }

    public draw(renderer:Renderer){
        //update bone-debug-mesh
        //update attached meshes
        //fill vertex buffer

        //draw bone-debug-mesh
        //draw mesh

        if (this.showDebugBone){
            if (this.boneDebugMesh == null) {
                this.boneDebugMesh = new Mesh(renderer)
                this.boneDebugMesh.x = this.x
                this.boneDebugMesh.y = this.y
                this.boneDebugMesh
            } else {

            }            
        }
    }

}