import Matrix4 from "../webgl/matrix4";
import Mesh from "../webgl/mesh";
import Spine from "./spine";
import SpineAtlas from "./spine-atlas";
import SpineBone from "./spine-bone";
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

    public localPos:Array<number> = null

    public relatedBones:Array<WeightBone> = []
    protected attachment:Attachment = null

    constructor(attachment:Attachment){
        this.attachment = attachment
    }

    public calRealPos(spine:Spine, bone:SpineBone, slot:SpineSlot) :Array<number> {
        let animation = spine.getAnimation()

        if (this.attachment.type == "mesh" && this.attachment.isWeighted) { 
            let newX:number=0, newY:number = 0
            for (let weightBone of this.relatedBones) {
                let bone = spine.getBoneAt(weightBone.boneIndex)
                if (bone != null) {
                    let newPos = SpineUtils.transformXYByMatrix(bone.worldTransform, weightBone.x, weightBone.y)
                    newX += newPos[0] * weightBone.w
                    newY += newPos[1] * weightBone.w
                }
            }
            return [newX, newY]
        } else if (this.attachment.type == "mesh") {
            //普通mesh
            let newPos = SpineUtils.transformXYByMatrix(bone.worldTransform, this.x, this.y)
            return newPos
        } else {
            //region图片，本地坐标为静态坐标
            if (this.localPos == null) {
                this.localPos = SpineUtils.transformXYByMatrix(this.attachment.localTransform, this.x, this.y)
            }        
            let newPos = SpineUtils.transformXYByMatrix(bone.worldTransform, this.localPos[0], this.localPos[1])
            return newPos    
        }
    }
}

type Attachments = {[k:string]:{[k:string]:Attachment}}

interface Skin {
    name?:string,
    attachments?: Attachments
}

export class Attachment {
    public type:string //region or mesh
    public isWeighted:boolean = false
    public json:AttachmentJson
    public triangles:Array<number> = []
    public vertices:Array<AttachmentVertex> = []
    public name:string = ""
    public localTransform:Matrix4 = new Matrix4()
    public skin:Skin = null
    public keyName:string = ""
    public setupVertices:Array<number> = [] //x,y,x,y.., setup vertices is use for mesh deform
    public setSkin(skin:Skin){
        this.skin = skin
    }
    public setKeyName(keyName:string){
        this.keyName = keyName
    }

    public setJson(json:AttachmentJson){
        this.json = json
        this.type = json.type != null ? json.type : "region"
        this.name = json.name != null ? json.name : ""
        if (this.type != "region" && this.type != "mesh"){
            console.warn("attchment type not supported now", this.type)
            return
        }
        if (this.type == "mesh") {
            //vertices=x1,y1,x2,y2 or boneCount,boneIndex1, boneX1, boneY1, w1,  boneIndex2, boneX2, boneY2, w2
            if (this.json.vertices.length > this.json.uvs.length) {
                this.isWeighted = true
                this.setupVertices = []
                let c = 0
                while (c<this.json.vertices.length) {
                    let boneCount = this.json.vertices[c++]
                    let vertex = new AttachmentVertex(this)
                    for (let i=0;i<boneCount;i++){
                        let boneIndex = this.json.vertices[c++]
                        let x = this.json.vertices[c++]
                        let y = this.json.vertices[c++]
                        let w = this.json.vertices[c++]
                        vertex.relatedBones.push({
                            x:x, y:y, w:w, boneIndex:boneIndex
                        })
                        this.setupVertices.push(x, y)
                    }
                    this.vertices.push(vertex)
                }
                this.triangles = this.json.triangles
            } else if (this.json.vertices.length == this.json.uvs.length) {
                this.setupVertices = []
                let count = this.json.vertices.length / 2
                for (let c=0;c<count;c++){
                    let vertex = new AttachmentVertex(this)
                    vertex.x = this.json.vertices[c*2]
                    vertex.y = this.json.vertices[c*2+1]
                    this.vertices.push(vertex)
                    this.setupVertices.push(vertex.x, vertex.y)
                }
                this.triangles = this.json.triangles
                
            }
            //uv
            let count = this.json.uvs.length / 2
            for (let c=0;c<count;c++){
                this.vertices[c].u = this.json.uvs[c*2]
                this.vertices[c].v = 1 - this.json.uvs[c*2+1] //flip y
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
           
            for (let p=0;p<points.length;p++) {
                let v = new AttachmentVertex(this)
                v.x = points[p][0]
                v.y = points[p][1]
                v.u = points[p][2]
                v.v = points[p][3]
                this.vertices.push(v)
            }
            
            this.triangles = [0, 1, 2, 1, 3, 2]
        }
   
        SpineUtils.updateTransformFromSRT(this.localTransform, 
            this.json.rotation != null ? this.json.rotation:0, 
            this.json.scaleX != null ? this.json.scaleX:1 ,  
            this.json.scaleY != null ? this.json.scaleY:1, 
            0, 0, 
            this.json.x != null ? this.json.x:0, 
            this.json.y != null ? this.json.y:0, 
        )
    
    }

    public updateDeform(spine:Spine, bone:SpineBone, slot:SpineSlot) {
        if (this.type != "mesh") {
            return
        }
        let animation = spine.getAnimation()
        if (animation == null) {
            return
        }
        animation.applyDeform(this.skin.name, slot.name,  this)
    }
}

export default class SpineMesh extends Mesh  {
    protected spine:Spine

    protected slots:Array<SpineSlot> = []
    protected slotsDict:{[k:string]:SpineSlot} = {}

    protected atlas:SpineAtlas = null

    protected defaultSkin:Skin = null
    protected skins:Array<Skin> = []

    
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
        for (let skinJson of skins) {
            let skin:Skin = {
                name : skinJson.name
            }
            let attachments :Attachments = {}
            for (let slotName in skinJson.attachments) {
                for (let attachmentName in skinJson.attachments[slotName]) {
                    let attachmentJson = skinJson.attachments[slotName][attachmentName]
                    let attachment = new Attachment()
                    attachment.setJson(attachmentJson)
                    attachment.setSkin(skin)
                    attachment.setKeyName(attachmentName)
                    if (attachments[slotName] == null) {
                        attachments[slotName] = {}
                    }
                    attachments[slotName][attachmentName] = attachment
                }
            }
            skin.attachments = attachments
            if (skin.name == "default") {
                this.defaultSkin = skin
            } else {
                this.skins.push(skin)
            }
        }
     
        console.log(this.skins, this.defaultSkin)
    }



    public getAttachment(slot:SpineSlot):Attachment {
        // if (slot.attachment ==  null){
        //     console.log("no attachment of slot", slot.name)
        //     return null
        // }
        let slotInfo = this.defaultSkin.attachments[slot.name]
        if (slotInfo == null) {
            for (let skin of this.skins) {
                //这里没有做skin强制指定
                slotInfo = skin.attachments[slot.name]
                if (slotInfo != null ){
                    break
                }
            }
        }
        
        if (slotInfo == null){
            // console.log("cannot find attachement", slot.name)
            return null
        }

        let animation = this.spine.getAnimation()
        let currentAttachment = slot.attachment
        if (animation != null) {
            //因为attachment有关键帧切换操作，所有animation里可能存储了这个信息
            let animationAttachment = animation.getAttachmentName(slot.name)
            if (animationAttachment == null){
                //这一帧不使用任何attachment
                return null
            } else if (animationAttachment == "") {
                //不存在attachment切换
            } else {
                currentAttachment = animationAttachment
            }
        }
        
        let attachment = slotInfo[currentAttachment]
        return attachment
    }


    protected preDraw() {
        // if (this.indices == null) {
        //     //先不考虑性能方面的问题，每次都重新上传vbo+ebo, todo
        // }

        //合并后计算出所有的顶点数据，索引数据
        let indices:Array<number> = []
        let points = []
        for (let slot of this.slots) {
            let bone = this.spine.getBone(slot.bone)
            let attachment = this.getAttachment(slot)
            let regionName = slot.attachment
            if (attachment && attachment.name != "") {
                regionName = attachment.name 
            }
            let region = this.atlas.getRegion(regionName)
            if (bone && attachment && region) {
                //attachment is deform mesh? need to update by deform animation
                attachment.updateDeform(this.spine, bone, slot)
                let vertices = attachment.vertices
                let startIndex = points.length
                for (let vert of vertices) {
                    let newPos = vert.calRealPos(this.spine, bone, slot) 
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