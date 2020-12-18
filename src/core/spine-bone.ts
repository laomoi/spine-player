export default class SpineBone {
    public name:string = ""
    public length:number = 0
    public x:number = 0
    public y:number = 0
    public rotation:number = 0
    public parent:string = ""

    public get parentBone():SpineBone {
        if (this.parent == ""){
            return null
        }
        return null
    }
    
}