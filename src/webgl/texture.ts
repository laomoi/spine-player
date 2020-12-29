import fs = require("fs")
import path = require("path")
import Renderer from "./renderer"

let decode = require('image-decode')

export default class Texture {
    protected static cache:{[k:string]:Texture} = {}
    public static getTexture(file:string, renderer:Renderer):Texture {
        if (Texture.cache[file]) {
            return Texture.cache[file]
        }
        let texture = new Texture()
        texture.loadFromFile(file, renderer)
        Texture.cache[file] = texture
        return texture
    }

    public static createFromWebglTexture(webglTexture:WebGLTexture, width:number, height:number){
        let texture = new Texture()
        texture.imageWidth = width
        texture.imageHeight = height
        texture.webglTexture = webglTexture
        return texture
    }

    public imageWidth:number
    public imageHeight:number
    public imageData:any
    public webglTexture:WebGLTexture

    public loadFromFile(file:string, renderer:Renderer) {
        let {data, width, height} = decode(fs.readFileSync(path.join(__dirname, "../../res/" + file)))
        this.imageWidth = width
        this.imageHeight = height
        this.imageData = data
        this.webglTexture = renderer.createTexture(0, null, data, width, height)
    }
}
