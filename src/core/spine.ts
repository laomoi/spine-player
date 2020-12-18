import Renderer from "../webgl/renderer";
import SpineBone from "./spine-bone";
import SpineData from "./spine-data";
import SpineUtils from "./spine-utils";

export default class Spine {

    protected data:SpineData

    protected animation:string
    protected bones:Array<SpineBone> = []
    
    
    public constructor(data:SpineData) {
        this.data = data
        //创建bones
    }

    public setAnimation(animation:string) {
        if (this.data.hasAnimation(animation)){
            this.animation = animation
            this.resetAnimation()
        }
    }

    protected resetAnimation() {

    }

    public update(){
        //update bones
        //update bone-debug-mesh
        //update attached meshes
    }

    public draw(renderer:Renderer){
        //fill vertex buffer

        //draw bone-debug-mesh
        //draw mesh
    }

}