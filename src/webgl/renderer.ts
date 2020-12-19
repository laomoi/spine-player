import Matrix4 from "./matrix4"
import Shader, { DefaultShader, ShaderUniform, SHADER_UNIFORM_TYPE } from "./shader"


export default class Renderer {
    protected gl:WebGLRenderingContext
    protected width:number
    protected height:number
    protected matrixProjection:Matrix4
    protected defaultShader:Shader = null


    public setGL(gl:WebGLRenderingContext, width:number, height:number) {
        this.gl = gl
        this.width = width
        this.height = height
        this.matrixProjection = new Matrix4()
        this.matrixProjection.setOrg(width, height)//投影矩阵, 2D里简单处理成： 把世界坐标转成[-1,1]的值
    }

    public clear() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    }

    public createTexture( n:number, image: HTMLImageElement | ImageBitmap=null, buffer:ArrayBufferView=null, width:number=0, height:number=0):WebGLTexture {
        let gl = this.gl
        let texture:WebGLTexture = gl.createTexture()
        gl.activeTexture(gl.TEXTURE0 + n)
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)  // flipy at web 
        if (buffer) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0 ,gl.RGBA, gl.UNSIGNED_BYTE, buffer)
        } else {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
        }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        return texture
    }

    public useTexture(texture:WebGLTexture, unit:number) {
        let gl = this.gl
        gl.activeTexture(gl.TEXTURE0 + unit)
        gl.bindTexture(gl.TEXTURE_2D, texture)
    }

    public createShader(vsSource:string, fsSource:string):WebGLProgram{
        let gl = this.gl
      
        //编译着色器
        let vertShader = gl.createShader(gl.VERTEX_SHADER)
        gl.shaderSource(vertShader, vsSource)
        gl.compileShader(vertShader)

        let fragShader = gl.createShader(gl.FRAGMENT_SHADER)
        gl.shaderSource(fragShader, fsSource)
        gl.compileShader(fragShader)

        //合并程序
        let shaderProgram = gl.createProgram()
        gl.attachShader(shaderProgram, vertShader);
        gl.attachShader(shaderProgram, fragShader);
        gl.linkProgram(shaderProgram)
        return shaderProgram
    }

    public useShader(shaderProgram:WebGLProgram, uniforms:Array<ShaderUniform>=null) {
        let gl = this.gl
        gl.useProgram(shaderProgram)
        if (uniforms != null) {
            for (let u of uniforms) {
                let name = u.name
                let value = u.value
                let type = u.type
                let location = gl.getUniformLocation(shaderProgram, name)
                if (location != null) {
                    if (type == SHADER_UNIFORM_TYPE.TYPE_1i) {
                        gl.uniform1i(location, value)
                    } else if (type == SHADER_UNIFORM_TYPE.TYPE_MATRIX_4F) {
                        gl.uniformMatrix4fv(location, false, value)
                    } else {
                        console.log("not supporting uniform type")
                    }
                }
            }
        }
        //default set projection matrix
        let pLocation = gl.getUniformLocation(shaderProgram, "P")
        if (pLocation){
            gl.uniformMatrix4fv(pLocation, false, this.matrixProjection.arrayValue)
        }
    }


    public getAttrLocation(shaderProgram:WebGLProgram, name:string) {
        let gl = this.gl
        return gl.getAttribLocation(shaderProgram, name)
    }

    public createVBO(vertices:Float32Array ) {
        let gl = this.gl
        let vbo = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW)
        return vbo
    }


    public updateVBO(vbo:WebGLBuffer, vertexs:Float32Array) {
        let gl = this.gl
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
        gl.bufferData(gl.ARRAY_BUFFER, vertexs, gl.DYNAMIC_DRAW)
    }

    public useVBO(vbo:WebGLBuffer, bytesPerVertex:number, attributes:Array<{location:number, size:number}>) {
        let gl = this.gl
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
        let offset = 0
        let floatSize = Float32Array.BYTES_PER_ELEMENT
        for (let i = 0; i < attributes.length; i++) {
            let attrib = attributes[i]
            let location = attrib.location
            let sizeOfAttrib = attrib.size
            gl.enableVertexAttribArray(location)
            gl.vertexAttribPointer(location, sizeOfAttrib, gl.FLOAT, false, bytesPerVertex, offset * floatSize)
            offset += sizeOfAttrib
        }
    }

    
    public createEBO(indices:any) {
        let gl = this.gl
        let ebo = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.DYNAMIC_DRAW)
        return ebo
    }

    public useEBO(ebo:WebGLBuffer=null) {
        let gl = this.gl
        if (ebo) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo)
        }
    }

    public draw(vertexCount:number, usingEBO:boolean=true) {
        let gl = this.gl
        if (usingEBO){
            gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_SHORT, 0)
        } else {
            gl.drawArrays(gl.TRIANGLES, 0, vertexCount)
        }
    }

    public setBlendMode(srcBlend: number, dstBlend: number) {
        let gl = this.gl
        gl.blendFunc(srcBlend, dstBlend)
    }

    public setAlphaBlendMode(){
        let gl = this.gl
        this.setBlendMode(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    }

    public enableBlend(){
        this.gl.enable(this.gl.BLEND)
    }

    public getDefaultShader():Shader{
        if (this.defaultShader == null){
            this.defaultShader = new DefaultShader(this)
        }
        return this.defaultShader
    }
}