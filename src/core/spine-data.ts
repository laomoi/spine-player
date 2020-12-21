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
    time?: number,
    angle?: number,
    x?: number,
    y?: number,
    rotation?:number,
    curve?: string,

}

export interface AnimationBoneJson {
    rotate?:Array<AnimationKeyFrameJson>,
    scale?:Array<AnimationKeyFrameJson>,
    translate?:Array<AnimationKeyFrameJson>,
    shear?:Array<AnimationKeyFrameJson>,
}

export interface AnimationJson {
    bones:{[k:string]:AnimationBoneJson}
}

export interface AttachmentJson {
    x?: number,
    y?: number,
    width?:number,
    height?:number,
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