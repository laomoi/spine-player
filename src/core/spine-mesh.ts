import Mesh from "../webgl/mesh";
import Spine from "./spine";
import SpineAtlas from "./spine-atlas";
import SpineSlot from "./spine-slot";
import SpineUtils from "./spine-utils";

export default class SpineMesh extends Mesh {
    protected spine:Spine

    protected slots:Array<SpineSlot> = []
    protected slotsDict:{[k:string]:SpineSlot} = {}

    protected atlas:SpineAtlas = null


    public createFromAtlas(atlas:string, png:string) {
        this.atlas = new SpineAtlas(atlas, png, this.renderer)

        this.createSlots()

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
    
    public updateFromSpine() {
        
    }


    public setSpine(spine:Spine) {
        this.spine = spine
    }

    protected onTextureSet() {
        super.onTextureSet()
        // //一根骨骼使用4个顶点
        // let bones = this.spine.getBones()
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