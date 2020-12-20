import Renderer  from "./renderer"
import Shader, { ShaderUniform } from "./shader"
import Texture from "./texture"

export default class Mesh {
    public texture:Texture
    public points:Array<any> = []
    public indices:Uint16Array = null

    protected renderer:Renderer
    protected shader:Shader
    protected attributes:Array<{location:number, size:number}> = []
    protected uniforms:Array<ShaderUniform> = []

    private _x:number = 0
    private _y:number = 0

    //use for vbo, ebo drawing
    protected vertices:Float32Array
    protected bytesPerVertex:number
    protected elementsCountPerVertex:number
    protected vertsDirty:boolean = false
    public vbo:WebGLBuffer = null
    public ebo:WebGLBuffer = null

    constructor(renderer:Renderer) {
        this.renderer = renderer
    }

    public get x():number {
        return this._x
    }

    public get y():number {
        return this._y
    }
    
    public set x(x:number){
        this._x = x
        this.vertsDirty = true
    }

    public set y(y:number){
        this._y = y
        this.vertsDirty = true
    }

    public setImage(file:string) {
        this.texture = Texture.getTexture(file, this.renderer)
        this.vertsDirty = true
        this.onSetImage()
    }

    protected onSetImage() {
        this.setShader(this.renderer.getDefaultShader())
    }

    public setShader(shader:Shader) {
        this.shader = shader
        this.shader.onMeshUseShader(this)
    }

    public setUniform(uniform:ShaderUniform) {
        for (let i=0;i<this.uniforms.length;i++){
            if (this.uniforms[i].name == uniform.name){
                this.uniforms.splice(i, 1)
                break
            }
        }
        this.uniforms.push(uniform)
    }

    public setMeshAttributes(attributes:Array<{location:number, size:number}>) {
        this.attributes = attributes

        let bytesPerVertex = 0
        let elementsCountPerVertex = 0
        for (let i = 0; i < attributes.length; i++) {
            let attrib = attributes[i]
            let sizeOfAttrib = attrib.size
            bytesPerVertex += sizeOfAttrib*Float32Array.BYTES_PER_ELEMENT
            elementsCountPerVertex += sizeOfAttrib
        }
        this.bytesPerVertex = bytesPerVertex
        this.elementsCountPerVertex = elementsCountPerVertex 
    }


    public update() {
        if (this.vertices == null) {
            this.vertices = new Float32Array(this.points.length * this.elementsCountPerVertex)
        } 
        this.updateVertices()
        this.vertsDirty = false
    }

    protected updateVertices() {
        //计算世界坐标
        for (let p=0;p<this.points.length;p++) {
            this.vertices[p*4] = this.points[p][0] + this.x
            this.vertices[p*4+1] = this.points[p][1] + this.y
            this.vertices[p*4+2] = this.points[p][2] //u
            this.vertices[p*4+3] = this.points[p][3] //v
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
        this.renderer.useShader(this.shader.webglShader, this.uniforms)
        this.renderer.useTexture(this.texture.webglTexture, 0) //mesh use 1 texture currently
        this.renderer.useVBO(this.vbo, this.bytesPerVertex, this.attributes)
        this.renderer.useEBO(this.ebo)
        this.renderer.draw(this.indices.length, true)
    }

    public setVertsDiry(){
        this.vertsDirty = true
    }

}

export class Sprite extends Mesh {
    public onSetImage() {
        super.onSetImage()
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

