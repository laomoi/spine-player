import { SlotJson } from "./spine-data"
import { Attachment } from "./spine-mesh"


export default class SpineSlot {
    protected json:SlotJson = null
    
    public name:string
    public bone:string
    public attachment:string

    public setJson(json:SlotJson) {
        this.json = json
        this.name = json.name
        this.bone = json.bone
        this.attachment = json.attachment
    }

    public updateAnimation() {

    }

    public updateTransform(){
    }

}
