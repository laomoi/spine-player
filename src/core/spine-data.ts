export interface BoneJson {
    name: string,
    length?:number,
    x?:number,
    y?:number,
    rotation?:number,
    shearX?:number,
    shearY?:number,
    scaleX?:number,
    scaleY?:number,
    parent?:string
}

export interface SlotJson {
    name: string,
    bone?: string,
    attachment?:string
}
export interface AnimationKeyFrameJson {
    time?: number
    curve?: string, //might be c1
    c2?:number,
    c3?:number,
    c4?:number, //(c1,c2), (c3,c4) are the bezier-3 curve control points
}

export interface AnimationBoneKeyFrameJson extends AnimationKeyFrameJson{
    angle?: number,
    x?: number,
    y?: number,
}

export interface AnimationDeformFrameJson  extends AnimationKeyFrameJson {
    vertices?:Array<number>,
    offset?:number,
}


export interface AnimationAttachmentKeyFrameJson  extends AnimationKeyFrameJson {
    name?:string,
}

export interface AnimationBoneJson {
    rotate?:Array<AnimationBoneKeyFrameJson>,
    scale?:Array<AnimationBoneKeyFrameJson>,
    translate?:Array<AnimationBoneKeyFrameJson>,
    shear?:Array<AnimationBoneKeyFrameJson>,
}


export interface AnimationSlotJson {
    attachment?:Array<AnimationAttachmentKeyFrameJson>,
}

export interface AnimationJson {
    bones?:{[k:string]:AnimationBoneJson},
    slots?:{[k:string]:AnimationSlotJson},
    deform?:{[k:string]:{[k:string]:{[k:string]:Array<AnimationDeformFrameJson>}}}, //skin.slot.attachment
}

export interface AttachmentJson {
    x?: number,
    y?: number,
    width?:number,
    height?:number,
    type?:string, //default region
    name?:string,
    //region
    scaleX?:number,
    scaleY?:number,
    rotation?:number,
    //mesh
    uvs?: Array<number>,
    triangles?: Array<number>,
    vertices?: Array<number>,
    hull?: number,
    edges: Array<number>,
}

export interface SkinJson {
    name: string,
    attachments:{[k:string]:{[k:string]:AttachmentJson}},
}


export interface SpineJson {
    bones:Array<BoneJson>,
    slots:Array<SlotJson>,
    animations:{[k:string]:AnimationJson},
    skins:Array<SkinJson>,
}

export default class SpineData {
    public json:SpineJson

    public setJson(json:SpineJson) {
        this.json = json
    }

    public getAnimationData(animationName:string):AnimationJson{
        return this.json.animations[animationName]
    }

    public getAnimationList():Array<string> {
        let list = []
        for (let k in this.json.animations) {
            list.push(k)
        }
        return list
    }
}