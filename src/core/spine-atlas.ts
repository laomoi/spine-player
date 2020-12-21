import Renderer from "../webgl/renderer"
import Texture from "../webgl/texture"
import fs = require("fs")
import path = require("path")
export default class SpineAtlas {

    public texture:Texture
    public constructor(atlas:string, png:string, renderer:Renderer) {
        this.texture = Texture.getTexture(png, renderer)
        let atlasContent = fs.readFileSync(path.join(__dirname, "../../res/" + atlas))
        
    }
}