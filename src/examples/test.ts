import Renderer from "../webgl/renderer"
import fs = require("fs")
import path = require("path")

let decode = require('image-decode')


export default class Test {
    
    private _inited:boolean =false

    protected verticesCount:number = 0
    protected textureUnit:number = 0
    protected vbo:WebGLBuffer = null
    protected ebo:WebGLBuffer = null


    protected createVerticesFromImage(renderer:Renderer, width:number, height:number, x:number, y:number) {
        //屏幕上的4个点坐标
        let points = [
            [0, height, 0, 1],      //左上角 x, y, u, v
            [0, 0, 0, 0],           //左下角
            [width, height, 1, 1],  //右上角
            [width, 0, 1, 0],       //右下角
        ]

        let vertices = []
        for (let p of points) {
            vertices.push(renderer.normalizeScreenX(p[0] + x))
            vertices.push(renderer.normalizeScreenY(p[1] + y))
            vertices.push(p[2])
            vertices.push(p[3])
        }
        return new Float32Array(vertices)
    }
    protected init(renderer:Renderer) {
        let {data, width, height} = decode(fs.readFileSync(path.join(__dirname, "../../res/test.png")))

        let vsSource = fs.readFileSync(path.join(__dirname, "../../res/shaders/test.vs"), "utf8")
        let fsSource = fs.readFileSync(path.join(__dirname, "../../res/shaders/test.fs"), "utf8")

        let shader = renderer.createShader(vsSource, fsSource)
        let vsAttributes:Array<{location:number, size:number}> = []
        vsAttributes.push({location: renderer.getAttrLocation(shader, "a_Position"), size: 2})
        vsAttributes.push({location: renderer.getAttrLocation(shader, "a_TexCoord"), size: 2})

        //屏幕上的4个点坐标


        let vertices = this.createVerticesFromImage(renderer, width, height, 100, 100)
        let indices = new Uint16Array([
            0, 1, 2,
            1, 3, 2
        ])

        this.verticesCount = indices.length

        this.vbo = renderer.createVBO(vertices, vsAttributes)
        this.ebo = renderer.createEBO(indices)
        let texture = renderer.createTexture(this.textureUnit, null, data, width, height)

        renderer.useShader(shader)
        renderer.useTexture(texture, this.textureUnit)
        renderer.useVBO(this.vbo, this.ebo)
        this._inited = true
    }

    public run(renderer:Renderer) {
        if (!this._inited) {
            this.init(renderer)
        }

        renderer.draw(this.verticesCount, true)
    }
}