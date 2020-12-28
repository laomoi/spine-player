import Mesh from "../webgl/mesh"
import Renderer from "../webgl/renderer"
import fs = require("fs")
import path = require("path")
import Shader, { DefaultShader, SHADER_UNIFORM_TYPE } from "../webgl/shader"
import Sprite from "../webgl/sprite"
import Spine from "../core/spine"
import SpineAtlas from "../core/spine-atlas"
import SpineData from "../core/spine-data"
import SpineUtils from "../core/spine-utils"
import SpineMesh from "../core/spine-mesh"


export class InstanceShader extends Shader {
    protected attributes:Array<{location:number, size:number}> = []

    public constructor(renderer:Renderer) {
        super(renderer)
        let vsSource = fs.readFileSync(path.join(__dirname, "../../res/shaders/instancing.vs"), "utf8")
        let fsSource = fs.readFileSync(path.join(__dirname, "../../res/shaders/instancing.fs"), "utf8")
        this.createFromSource(vsSource, fsSource)
        this.onCreated()
    }

    protected onCreated() {
        this.attributes.push({location: this.queryLocOfAttr( "a_Position"), size: 2})
        this.attributes.push({location: this.queryLocOfAttr("a_TexCoord"), size: 2})
    }

    public onMeshUseShader(mesh:any) {
        mesh.setUniform({name:"u_Sampler", value:0, type:SHADER_UNIFORM_TYPE.TYPE_1i }) //unit 0 sampler
        mesh.setMeshAttributes(this.attributes)
    }
}


export default class TestInstance {
    
    private _inited:boolean =false

    protected meshes:Array<Mesh> = []
    
  
    protected spine:Spine    

    protected debugLabel:HTMLSpanElement
    protected paused:boolean = false

    protected ext:any

    protected mesh:SpineMesh
    protected positions:Array<number> = []
    protected positionsArray:Float32Array = null
    protected positionBuffer:WebGLBuffer
    protected positionsLoc:number
    protected instanceCount:number = 1000
    protected init(renderer:Renderer) {
        this._inited = true
        renderer.enableBlend()
        renderer.setAlphaBlendMode()

        //setup spine
        let jsonFile = "sp_shuicao.json"// goblins-pro
        let atlasFile = "sp_shuicao.atlas"
        let pngFile = "sp_shuicao.png"

        let spineData = new SpineData()
        spineData.setJson(SpineUtils.readJsonFile(jsonFile))
        let spineAtlas = new SpineAtlas(atlasFile, pngFile, renderer)
     
        let spine = new Spine(spineData)
        spine.setAnimation("animation")
        this.mesh = spine.createMesh(renderer, spineAtlas)
        this.spine = spine

        //setup instancing data
        let ext = renderer.getExtension("ANGLE_instanced_arrays")
        if (!ext) {
            console.error('need ANGLE_instanced_arrays')
            return
        }
        this.ext = ext

        for (let i=0;i<this.instanceCount;i++) {
            this.positions.push(100 + Math.random()*700)
            this.positions.push(100 + Math.random()*500)

        }
        this.positionsArray = new Float32Array(this.positions)
        this.positionBuffer = renderer.createVBO(this.positionsArray)
        let shader = new InstanceShader(renderer)
        this.mesh.setShader(shader)
        this.positionsLoc = shader.queryLocOfAttr("a_Position_instancing")
        // this.addDebugUI(renderer)
    }

    public run(renderer:Renderer) {
        if (!this._inited) {
            this.init(renderer)
            
        }
        if (!this.paused){
            this.update(renderer)
        }
    }

    protected update(renderer:Renderer) {
        renderer.clear()
        this.spine.update()
        //draw instances of mesh
        let gl = renderer.getGL()
        this.mesh.preDraw()
        this.mesh.fillBuffers()
        this.mesh.useShader()
        this.mesh.useTexture() //mesh use 1 texture currently
        this.mesh.useVBO()
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
        gl.enableVertexAttribArray(this.positionsLoc)
        gl.vertexAttribPointer(this.positionsLoc, 2, gl.FLOAT, false, 0, 0)
        this.ext.vertexAttribDivisorANGLE(this.positionsLoc, 1)

        this.mesh.useEBO()
        this.ext.drawElementsInstancedANGLE(
            gl.TRIANGLES,
            this.mesh.indices.length,  //elements count          
            gl.UNSIGNED_SHORT,  
            0,  //offset
            this.instanceCount, //instance count
        )
    }

    // protected addDebugUI(renderer:Renderer) {
    //     let self = this
    //     let debugElement = document.getElementById("debug")
    //     let button = document.createElement("Button")
    //     button.innerHTML = "单帧调试"
    //     let button2 = document.createElement("Button")
    //     button2.innerHTML = "暂停"

    //     let label = document.createElement("span")
    //     button.onclick = function() {
    //         self.update(renderer)
    //     }
    //     button2.onclick = function() {
    //         self.paused = true
    //     }

    //     debugElement.append(button)
    //     debugElement.append(button2)

    //     debugElement.append(label)
    //     this.debugLabel = label
    // }
}