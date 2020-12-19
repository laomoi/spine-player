export interface BoneJson {
    name: string,
    length?:number,
    x?:number,
    y?:number,
    rotation?:number,
    parent?:string
}

export interface SpineJson {
    bones:Array<BoneJson>
}

export default class SpineData {
    public json:SpineJson

    public setJson(json:SpineJson) {
        this.json = json
    }

    public hasAnimation(animation:string){
        return true
    }
}