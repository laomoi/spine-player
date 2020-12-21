import { SlotJson } from "./spine-data"

export default class SpineSlot {
    protected json:SlotJson = null
    
    public name:string
    public bone:string
    public x:number
    public y:number
    public width:number
    public height:number

    public setJson(json:SlotJson) {
        this.json = json
        this.name = json.name
    }
}
