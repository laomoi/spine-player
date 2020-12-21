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

export interface SpineJson {
    bones:Array<BoneJson>,
    animations:{[k:string]:AnimationJson}
}

export default class SpineData {
    public json:SpineJson

    public setJson(json:SpineJson) {
        this.json = json
    }

    public getAnimationData(animationName:string):AnimationJson{
        return this.json.animations[animationName]
    }
}