import Renderer, { SHADER_UNIFORM_TYPE } from "./renderer";
import fs = require("fs")
import path = require("path")

export default class Shader {
    public webglShader:WebGLProgram
    protected renderer:Renderer
    constructor(renderer:Renderer) {
        this.renderer = renderer
    }

    public createFromSource(vsSource:string, fsSource:string) {
        this.webglShader = this.renderer.createShader(vsSource, fsSource)
    }

    public onMeshUseShader(mesh:any) {

    }
}

export class DefaultShader extends Shader {
    protected attributes:Array<{location:number, size:number}> = []

    public constructor(renderer:Renderer) {
        super(renderer)
        let vsSource = fs.readFileSync(path.join(__dirname, "../../res/shaders/default.vs"), "utf8")
        let fsSource = fs.readFileSync(path.join(__dirname, "../../res/shaders/default.fs"), "utf8")
        this.createFromSource(vsSource, fsSource)
        this.onCreated()
    }

    protected onCreated() {
        this.attributes.push({location: this.renderer.getAttrLocation(this.webglShader, "a_Position"), size: 2})
        this.attributes.push({location: this.renderer.getAttrLocation(this.webglShader, "a_TexCoord"), size: 2})
    }

    public onMeshUseShader(mesh:any) {
        mesh.setUniform({name:"u_Sampler", value:0, type:SHADER_UNIFORM_TYPE.TYPE_1i }) //unit 0 sampler
        mesh.setMeshAttributes(this.attributes)
    }
}