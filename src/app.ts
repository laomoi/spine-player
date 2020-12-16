import Renderer from "./webgl/renderer"

import fs = require("fs")
import path = require("path")

export default class App {

    protected gl:WebGLRenderingContext

    protected showFPSCallback:any = null

    public setGL(gl:WebGLRenderingContext) {
        this.gl = gl
    }

    public run() {
        console.log("run app")
        let renderer = new Renderer()
        renderer.setGL(this.gl)
        console.log(renderer)

        this.test(renderer)
    }

    public setShowFPSCallback(callback:any) {
        this.showFPSCallback = callback
    }

    protected test(renderer:Renderer) {
        let textureImage = new Image()
        textureImage.onload = function() { 
            
            let vsSource = fs.readFileSync(path.join(__dirname, "../res/shaders/test.vs"), "utf8")
            let fsSource = fs.readFileSync(path.join(__dirname, "../res/shaders/test.fs"), "utf8")

            let shader = renderer.createShader(vsSource, fsSource)
            let vsAttributes:Array<{location:number, size:number}> = []
            vsAttributes.push({location: renderer.getAttrLocation(shader, "a_Position"), size: 3})
            vsAttributes.push({location: renderer.getAttrLocation(shader, "a_TexCoord"), size: 2})

            let vertices =  new Float32Array([
                -1, 1, 0.0, 0.0, 1.0,
                -1, -1, 0.0, 0.0, 0.0,
                1, 1, 0.0, 1.0, 1.0,
                1, -1, 0.0, 1.0, 0.0])
            let indices = new Uint16Array([
                0, 1, 2,
                1, 3, 2
            ])

            let vbo = renderer.createVBO(vertices, vsAttributes)
            let ebo = renderer.createEBO(indices)
            let textureUnit = 0
            let texture = renderer.createTexture(textureImage, textureUnit)
            renderer.useShader(shader)
            renderer.useTexture(texture, textureUnit)
            renderer.useVBO(vbo, ebo)
            renderer.draw(indices.length, true)

        }
        textureImage.src = path.join(__dirname, "../res/test.png")



       
    }
}