export default class Renderer {
    protected gl:WebGLRenderingContext

    constructor() {

    }

    public setGL(gl:any) {
        this.gl = gl
    }

    public createTexture(image: HTMLImageElement | ImageBitmap , n:number):WebGLTexture {
        let gl = this.gl
        let texture:WebGLTexture = gl.createTexture()
        gl.activeTexture(gl.TEXTURE0 + n)
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        return texture
    }

    public useTexture(texture:WebGLTexture, n:number) {
        let gl = this.gl
        gl.activeTexture(gl.TEXTURE0 + n)
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

    public useShader(shaderProgram:WebGLProgram, uniforms:Array<{name:string, value:any, type:string}>=null) {
        let gl = this.gl
        gl.useProgram(shaderProgram)
        if (uniforms != null) {
            for (let u of uniforms) {
                let name = u.name
                let value = u.value
                let type = u.type
                let location = gl.getUniformLocation(shaderProgram, name)
                if (location != null) {
                    if (type == "1i") {
                        gl.uniform1i(location, value)
                    } else {
                        console.log("not supporting uniform type")
                    }
                }
            }
        }
    }

    public getAttrLocation(shaderProgram:WebGLProgram, name:string) {
        let gl = this.gl
        return gl.getAttribLocation(shaderProgram, name)
    }

    public createVBO(vertexs:Float32Array, attributes:Array<{location:number, size:number}>=[]) {
        let gl = this.gl
        let vbo = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
        gl.bufferData(gl.ARRAY_BUFFER, vertexs, gl.DYNAMIC_DRAW)
        //buffer layout
        let offset = 0
        let floatSize = vertexs.BYTES_PER_ELEMENT
        let vertexSize = 0
        for (let i = 0; i < attributes.length; i++) {
            let attrib = attributes[i]
            let sizeOfAttrib = attrib.size
            vertexSize += sizeOfAttrib*floatSize
        }
        for (let i = 0; i < attributes.length; i++) {
            let attrib = attributes[i]
            let location = attrib.location
            let sizeOfAttrib = attrib.size
            gl.enableVertexAttribArray(location)
            gl.vertexAttribPointer(location, sizeOfAttrib, gl.FLOAT, false, vertexSize, offset * floatSize)
            offset += sizeOfAttrib
        }
        return vbo
    }

    public updateVBO(vbo:WebGLBuffer, vertexs:Float32Array) {
        let gl = this.gl
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
        gl.bufferData(gl.ARRAY_BUFFER, vertexs, gl.DYNAMIC_DRAW)
    }

    public createEBO(indices:any) {
        let gl = this.gl
        let ebo = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.DYNAMIC_DRAW)
        return ebo
    }

    public useVBO(vbo:WebGLBuffer, ebo:WebGLBuffer=null) {
        let gl = this.gl
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
        if (ebo) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbo)
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

}