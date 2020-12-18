import Renderer from "./renderer"
import Texture from "./texture"

export default class Mesh {
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

export class Sprite extends Mesh {
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

