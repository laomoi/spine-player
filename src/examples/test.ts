import Mesh, { Sprite } from "../webgl/mesh"
import Renderer from "../webgl/renderer"
import fs = require("fs")
import path = require("path")
import Shader, { DefaultShader } from "../webgl/shader"

export default class Test {
    
    private _inited:boolean =false

    protected meshes:Array<Mesh> = []
    
    protected init(renderer:Renderer) {
        let sprite1 = new Sprite(renderer)
        sprite1.setImage("test.png")
        sprite1.x = 100
        sprite1.y = 100
        this.meshes.push(sprite1)

        let sprite2 = new Sprite(renderer)
        sprite2.setImage("test2.png")
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