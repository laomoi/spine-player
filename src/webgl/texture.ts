import fs = require("fs")
import path = require("path")
import Renderer from "./renderer"

let decode = require('image-decode')

export default class Texture {
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
