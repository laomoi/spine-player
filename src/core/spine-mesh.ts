import Matrix4 from "../webgl/matrix4";
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

export class Attachment {
    public type:string //region or mesh
    public isWeighted:boolean = false
    public json:AttachmentJson
    public triangles:Array<number> = []
    public vertices:Array<AttachmentVertex> = []
    public x:number
    public y:number

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
                this.triangles = this.json.triangles
            } else if (this.json.vertices.length == this.json.uvs.length) {
                let count = this.json.vertices.length / 2
                for (let c=0;c<count;c++){
                    let vertex = new AttachmentVertex()
                    vertex.x = this.json.vertices[c*2]
                    vertex.y = this.json.vertices[c*2+1]
                    this.vertices.push(vertex)
                }
                this.triangles = [0, 1, 2, 1, 3, 2]
            }
            //uv
            let count = this.json.uvs.length / 2
            for (let c=0;c<count;c++){
                this.vertices[c].u = this.json.uvs[c*2]
                this.vertices[c].v = this.json.uvs[c*2+1]
            }
        } else if (this.type == "region") {
            let points =  
            [
                [-this.json.width/2, this.json.height/2, 0, 1],                //左上角 x, y, u, v
                [-this.json.width/2, -this.json.height/2, 0, 0],                               //左下角
                [this.json.width/2, this.json.height/2, 1, 1],  //右上角
                [this.json.width/2, -this.json.height/2, 1, 0]
            ]
            this.vertices = []
            //attachment自身有transform? scale, roate, translate..
            let localTransform = new Matrix4()
            SpineUtils.updateTransformFromSRT(localTransform, 
                this.json.rotation != null ? this.json.rotation:0, 
                this.json.scaleX != null ? this.json.scaleX:1 ,  
                this.json.scaleY != null ? this.json.scaleY:1, 
                0, 0, 
                this.json.x != null ? this.json.x:0, 
                this.json.y != null ? this.json.y:0, 
            )
            for (let p=0;p<points.length;p++) {
                let v = new AttachmentVertex()
                v.x = points[p][0]
                v.y = points[p][1]
                v.u = points[p][2]
                v.v = points[p][3]
                let newPos = SpineUtils.transformXYByMatrix(localTransform, v.x, v.y)
                v.x = newPos[0]
                v.y = newPos[1]
                this.vertices.push(v)
            }
            
            this.triangles = [0, 1, 2, 1, 3, 2]
        }

        this.x = this.json.x || 0
        this.y = this.json.y || 0
    }

}

export default class SpineMesh extends Mesh  {
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

    public getAttachment(slot:SpineSlot) {
        let animation = this.spine.getAnimation()
        if (animation == null) {
            return this.attachments[slot.name][slot.attachment]
        }
        return null
    }


    protected preDraw() {
        if (this.indices == null) {
            
        }

        //合并后计算出所有的顶点数据，索引数据
        let indices:Array<number> = []
        let points = []
        for (let slot of this.slots) {
            let bone = this.spine.getBone(slot.bone)
            let attachment = this.getAttachment(slot)
            let region = this.atlas.getRegion(slot.attachment)
            if (bone && attachment && region) {
                let vertices = attachment.vertices
                let startIndex = points.length
                for (let vert of vertices) {
                    let newPos = SpineUtils.transformXYByMatrix(bone.worldTransform, vert.x, vert.y)
                    let realU = vert.u * region.uLen + region.u1
                    let realV = vert.v * region.vLen + region.v1
                    points.push([newPos[0], newPos[1], realU, realV])
                }
                for (let index of attachment.triangles) {
                    indices.push(index + startIndex)
                }
            }
        }
        this.points = points
        this.indices = new Uint16Array(indices)

        this.x = this.spine.x
        this.y = this.spine.y
        this.setVertsDiry()
        this.setVertsIndexDiry()
    }

}