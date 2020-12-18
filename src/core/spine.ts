import Renderer from "../webgl/renderer";
import SpineData from "./spine-data";
import SpineUtils from "./spine-utils";

export default class Spine {


    protected data:SpineData
    public constructor(jsonFile:string, atlasFile:string, pngFile:string) {
        this.data = new SpineData()
        this.data.fromJson(SpineUtils.readJsonFile(jsonFile))
        
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