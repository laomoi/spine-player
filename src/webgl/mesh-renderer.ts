export default class MeshRenderer {
    protected gl:any


    private texture: WebGLTexture = null;


    constructor() {

    }

    public setGL(gl:any) {
        this.gl = gl
    }

    public setTexture(image: HTMLImageElement | ImageBitmap) {
        let gl = this.gl

        this.texture = gl.createTexture()

        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.texture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    }

    public setMesh() {

    }

    public setShader() {

    }

    public render() {

    }

}