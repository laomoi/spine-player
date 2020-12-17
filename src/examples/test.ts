import Renderer from "../webgl/renderer"
import fs = require("fs")
import path = require("path")

let decode = require('image-decode')

class Texture {
    protected static cache:{[k:string]:Texture} = {}
    public static getTexture(file:string, renderer:Renderer, unit:number=0):Texture {
        if (Texture.cache[file]) {
            return Texture.cache[file]
        }
        Texture.cache[file] = new Texture(file, renderer, unit)
        return Texture.cache[file]
    }

    public imageWidth:number
    public imageHeight:number
    public imageData:any
    public textureUnit:number
    public webglTexture:WebGLTexture

    constructor(file:string, renderer:Renderer, unit:number) {
        let {data, width, height} = decode(fs.readFileSync(path.join(__dirname, "../../res/" + file)))
        this.imageWidth = width
        this.imageHeight = height
        this.imageData = data
        this.textureUnit = unit
        this.webglTexture = renderer.createTexture(unit, null, data, width, height)
    }
}

class Mesh {
    public texture:Texture
    public x:number
    public y:number
    public points:Array<any> = []
    public indices:Uint16Array = null

    protected renderer:Renderer
    protected shader:WebGLShader
    protected attributes:Array<{location:number, size:number}> = []

    //use for vbo, ebo drawing
    protected vertices:Float32Array
    protected bytesPerVertex:number
    protected vertsDirty:boolean = false
    public vbo:WebGLBuffer = null
    public ebo:WebGLBuffer = null

    constructor(renderer:Renderer) {
        this.renderer = renderer
    }

    public setImage(file:string) {
        this.texture = Texture.getTexture(file, this.renderer)
        this.vertsDirty = true
        this.onSetImage()
    }

    protected onSetImage() {

    }

    public setShader(shader:WebGLShader) {
        this.shader = shader
    }

    public setMeshAttributes(attributes:Array<{location:number, size:number}>) {
        this.attributes = attributes

        let bytesPerVertex = 0
        for (let i = 0; i < attributes.length; i++) {
            let attrib = attributes[i]
            let sizeOfAttrib = attrib.size
            bytesPerVertex += sizeOfAttrib*Float32Array.BYTES_PER_ELEMENT
        }
        this.bytesPerVertex = bytesPerVertex
    }


    public update() {
        if (this.vertices == null) {
            this.vertices = new Float32Array(this.points.length * this.bytesPerVertex)
        } 
        this.updateVertices()
        this.vertsDirty = false
    }

    protected updateVertices() {
        for (let p=0;p<this.points.length;p++) {
            this.vertices[p*4] = this.renderer.normalizeScreenX(this.points[p][0] + this.x)
            this.vertices[p*4+1] = this.renderer.normalizeScreenY(this.points[p][1] + this.y)
            this.vertices[p*4+2] = this.points[p][2]
            this.vertices[p*4+3] = this.points[p][3]
        }

        if (this.vbo == null){
            this.vbo = this.renderer.createVBO(this.vertices)
        } else {
            this.renderer.updateVBO(this.vbo, this.vertices)
        }

        if (this.ebo == null) {
            this.ebo = this.renderer.createEBO(this.indices)
        } 
    }


    public draw() {
        if (this.vertsDirty) {
            this.update()
        }
        this.renderer.useShader(this.shader)
        this.renderer.useTexture(this.texture.webglTexture, this.texture.textureUnit)
        this.renderer.useVBO(this.vbo, this.bytesPerVertex, this.attributes)
        this.renderer.useEBO(this.ebo)
        this.renderer.draw(this.indices.length, true)
    }

}

class QuadMesh extends Mesh {
    public onSetImage() {
        this.points = [
            [0, this.texture.imageHeight, 0, 1],                //左上角 x, y, u, v
            [0, 0, 0, 0],                                       //左下角
            [this.texture.imageWidth, this.texture.imageHeight, 1, 1],  //右上角
            [this.texture.imageWidth, 0, 1, 0],                         //右下角
        ]
        this.indices = new Uint16Array([
            0, 1, 2,
            1, 3, 2
        ])
    }
}


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

        let sprite1 = new QuadMesh(renderer)
        sprite1.setImage("test.png")
        sprite1.setShader(shader)
        sprite1.setMeshAttributes(attributes)
        sprite1.x = 100
        sprite1.y = 100
        this.meshes.push(sprite1)


        let sprite2 = new QuadMesh(renderer)
        sprite2.setImage("test2.png")
        sprite2.setShader(shader)
        sprite2.setMeshAttributes(attributes)
        sprite2.x = 200
        sprite2.y = 200
        this.meshes.push(sprite2)

        this._inited = true
    }

    public run(renderer:Renderer) {
        if (!this._inited) {
            this.init(renderer)
        }
        renderer.clear()
        for (let mesh of this.meshes) {
            mesh.draw()
        }
    }
}