import Mesh, { Sprite } from "../webgl/mesh"
import Renderer, { SHADER_UNIFORM_TYPE } from "../webgl/renderer"
import fs = require("fs")
import path = require("path")

export default class Test {
    
    private _inited:boolean =false

    protected meshes:Array<Mesh> = []
    
    protected init(renderer:Renderer) {
        let vsSource = fs.readFileSync(path.join(__dirname, "../../res/shaders/test.vs"), "utf8")
        let fsSource = fs.readFileSync(path.join(__dirname, "../../res/shaders/test.fs"), "utf8")

        let shader = renderer.createShader(vsSource, fsSource)
        let attributes:Array<{location:number, size:number}> = []
        attributes.push({location: renderer.getAttrLocation(shader, "a_Position"), size: 2})
        attributes.push({location: renderer.getAttrLocation(shader, "a_TexCoord"), size: 2})

        let sprite1 = new Sprite(renderer)
        sprite1.setImage("test.png")
        sprite1.setShader(shader)
        sprite1.setUniform({name:"u_Sampler", value:0, type:SHADER_UNIFORM_TYPE.TYPE_1i }) //unit 0 sampler
        sprite1.setMeshAttributes(attributes)
        sprite1.x = 100
        sprite1.y = 100
        
        this.meshes.push(sprite1)


        let sprite2 = new Sprite(renderer)
        sprite2.setImage("test2.png")
        sprite2.setShader(shader)
        sprite2.setUniform({name:"u_Sampler", value:0, type:SHADER_UNIFORM_TYPE.TYPE_1i })
        sprite2.setMeshAttributes(attributes)
        sprite2.x = 200
        sprite2.y = 200
        this.meshes.push(sprite2)

        renderer.enableBlend()
        renderer.setAlphaBlendMode()
        this._inited = true
    }

    public run(renderer:Renderer) {
        if (!this._inited) {
            this.init(renderer)
        }
        renderer.clear()

        for (let mesh of this.meshes) {
            //moving animation
            mesh.x += 1
            if (mesh.x >= 400) {
                mesh.x = 0
            }
        }

        for (let mesh of this.meshes) {
            mesh.draw()
        }
    }
}