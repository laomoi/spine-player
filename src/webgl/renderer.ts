export default class Renderer {
    protected gl:WebGLRenderingContext

    constructor() {

    }

    public setGL(gl:any) {
        this.gl = gl
    }

    public createTexture(image: HTMLImageElement | ImageBitmap, n:number):WebGLTexture {
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

    public useShader(shaderProgram:WebGLProgram, uniforms:any=null) {
        let gl = this.gl
        gl.useProgram(shaderProgram)
        if (uniforms != null) {
            for (let k in uniforms) {
                let location = gl.getUniformLocation(shaderProgram, k)
                if (location) {
                    let value = uniforms[k].value
                    let type = uniforms[k].type
                    if (type == "1i") {
                        gl.uniform1i(location, value)
                    }
                }
            }
        }
    }


    public drawMesh() {
        
    }

   

}