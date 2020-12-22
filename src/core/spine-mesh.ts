import Mesh from "../webgl/mesh";
import Spine from "./spine";
import SpineAtlas from "./spine-atlas";
import { AttachmentJson, SkinJson } from "./spine-data";
import SpineSlot from "./spine-slot";
import SpineUtils from "./spine-utils";

interface WeightBone {
    boneIndex:number,
    w:number,
    x:number,
    y:number
}

class AttachmentVertex {
    public x:number
    public y:number
    public u:number
    public v:number

    public relatedBones:Array<WeightBone> = []

    public calPositionByBones() {
    }
}

class Attachment {
    public type:string //region or mesh
    public isWeighted:boolean = false
    public json:AttachmentJson

    protected vertices:Array<AttachmentVertex> = []

    public setJson(json:AttachmentJson){
        this.json = json
        this.type = json.type != null ? json.type : "region"
        if (this.type != "region" && this.type != "mesh"){
            console.warn("attchment type not supported now", this.type)
            return
        }
        if (this.type == "mesh") {
            //vertices=x1,y1,x2,y2 or boneCount,boneIndex1, boneX1, boneY1, w1,  boneIndex2, boneX2, boneY2, w2
            if (this.json.vertices.length > this.json.uvs.length) {
                this.isWeighted = true
                let c = 0
                while (c<this.json.vertices.length) {
                    let boneCount = this.json.vertices[c++]
                    let vertex = new AttachmentVertex()
                    for (let i=0;i<boneCount;i++){
                        let boneIndex = this.json.vertices[c++]
                        let x = this.json.vertices[c++]
                        let y = this.json.vertices[c++]
                        let w = this.json.vertices[c++]
                        vertex.relatedBones.push({
                            x:x, y:y, w:w, boneIndex:boneIndex
                        })
                    }
                    this.vertices.push(vertex)
                }
            } else if (this.json.vertices.length == this.json.uvs.length) {
                let count = this.json.vertices.length / 2
                for (let c=0;c<count;c++){
                    let vertex = new AttachmentVertex()
                    vertex.x = this.json.vertices[c*2]
                    vertex.y = this.json.vertices[c*2+1]
                    this.vertices.push(vertex)
                }
            }
            //uv
            let count = this.json.uvs.length / 2
            for (let c=0;c<count;c++){
                this.vertices[c].u = this.json.uvs[c*2]
                this.vertices[c].v = this.json.uvs[c*2+1]
            }
        }
    }

    public getVertexCount():number {
        return this.vertices.length
    }
}


export default class SpineMesh extends Mesh {
    protected spine:Spine

    protected slots:Array<SpineSlot> = []
    protected slotsDict:{[k:string]:SpineSlot} = {}

    protected atlas:SpineAtlas = null

    protected defaultSkin:SkinJson 
    protected attachments:{[k:string]:{[k:string]:Attachment}} = {}

    
    public setSpine(spine:Spine) {
        this.spine = spine
    }

    public createFromAtlas(atlas:SpineAtlas) {
        this.atlas = atlas
        this.createSlots()
        this.createAttachments()
        this.setTexture(this.atlas.texture)
    }

    protected createSlots() {
        let data = this.spine.getData()
        for (let b of data.json.slots) {
            let slot = new SpineSlot()
            slot.setJson(b)
            this.slots.push(slot)
            this.slotsDict[slot.name] = slot
        }
    }

    protected createAttachments() {
        let data = this.spine.getData()
        let skins = data.json.skins
        for (let skin of skins) {
            if (skin.name == "default") {
                this.defaultSkin = skin
                break
            }
        }
        if (this.defaultSkin == null) {
            this.defaultSkin = data.json.skins[0]
        }

        for (let slotName in this.defaultSkin.attachments) {
            for (let attachmentName in this.defaultSkin.attachments[slotName]) {
                let attachmentJson = this.defaultSkin.attachments[slotName][attachmentName]
                let attachment = new Attachment()
                attachment.setJson(attachmentJson)
                if (this.attachments[slotName] == null) {
                    this.attachments[slotName] = {}
                }
                this.attachments[slotName][attachmentName] = attachment
            }
        }
        console.log(this.attachments)
    }

    public getAttachment(slotName:string, attachmentName:string):Attachment {
        return this.attachments[slotName][attachmentName]
    }
    
    public updateFromSpineBones() {
        // let points = this.points
        // let bones = this.spine.getSortedBones()
        // let boneHeight = this.texture.imageHeight
        // for (let b=0;b<bones.length;b++) {
        //     let bone = bones[b]
        //     let pointsPerBone = [
        //         [0, boneHeight/2, 0, 1],                        //左上角 x, y, u, v
        //         [0, -boneHeight/2, 0, 0],                       //左下角
        //         [bone.length, boneHeight/2, 1, 1],              //右上角
        //         [bone.length, -boneHeight/2, 1, 0],             //右下角 
        //     ]
        //     for (let p=0;p<pointsPerBone.length;p++) {
        //         let pt = pointsPerBone[p]
        //         let newPos = SpineUtils.transformXYByMatrix(bone.worldTransform, pt[0], pt[1])
        //         points[4*b+p] = [newPos[0], newPos[1], pt[2], pt[3]] //x, y, u, v
        //     }
        // }
        // this.x = this.spine.x
        // this.y = this.spine.y
        // this.setVertsDiry()
    }



    protected onTextureSet() {
        super.onTextureSet()
        // //一根骨骼使用4个顶点
        // let bones = this.spine.getSortedBones()
        // let pointsCount = 4 * bones.length
        // this.points = new Array<number>(pointsCount)
        // let indices:Array<number> = []
        // let indicesPerBone = [0, 1, 2, 1, 3, 2]
        // for (let b=0;b<bones.length;b++) {
        //     let startIndice = b*4
        //     for (let index of indicesPerBone) {
        //         indices.push(index + startIndice)
        //     }
        // }
        // this.indices = new Uint16Array(indices)
    }


    // public updateFromSpine() {
    //     let points = this.points
    //     let bones = this.spine.getBones()
    //     let boneHeight = this.texture.imageHeight
    //     for (let b=0;b<bones.length;b++) {
    //         let bone = bones[b]
    //         let pointsPerBone = [
    //             [0, boneHeight/2, 0, 1],                        //左上角 x, y, u, v
    //             [0, -boneHeight/2, 0, 0],                       //左下角
    //             [bone.length, boneHeight/2, 1, 1],              //右上角
    //             [bone.length, -boneHeight/2, 1, 0],             //右下角 
    //         ]
    //         for (let p=0;p<pointsPerBone.length;p++) {
    //             let pt = pointsPerBone[p]
    //             let newPos = SpineUtils.transformXYByMatrix(bone.worldTransform, pt[0], pt[1])
    //             points[4*b+p] = [newPos[0], newPos[1], pt[2], pt[3]] //x, y, u, v
    //         }
    //     }
    //     this.x = this.spine.x
    //     this.y = this.spine.y
    //     this.setVertsDiry()
    // }

    public update() {

    }

    public draw() {

    }
}