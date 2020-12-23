import Renderer from "../webgl/renderer"
import Texture from "../webgl/texture"
import fs = require("fs")
import path = require("path")


export class AtlasRegion {
    public name:string
    public width:number
    public height:number
    public originalWidth:number
    public originalHeight:number
    public offsetX:number
    public offsetY:number
    public x:number 
    public y:number
    public u1:number //左下角
    public v1:number
    public u2:number  //右下角
    public v2:number
    public uLen:number
    public vLen:number
} 

//todo, spine导出的纹理图集设置请关闭空白区域，旋转的勾选，简化uv计算逻辑
export default class SpineAtlas {

    public texture:Texture

    protected atlasInfo:any = {}

    protected regions:{[k:string]:AtlasRegion} = {}

    public constructor(atlas:string, png:string, renderer:Renderer) {
        this.texture = Texture.getTexture(png, renderer)
        let atlasContent = fs.readFileSync(path.join(__dirname, "../../res/" + atlas), "utf8")
        this.parseAtlas(atlasContent)
    }

    protected parseAtlas(content:string) {
        let lines = content.split(/\r\n|\n/)
        let regPng = /^(.*?\.png)/
        let regFrameName = /^([^:]+)$/
        let headerKvReg = /^(\w+)\:\s*(.*)/
        let kvReg = /\s+(\w+)\:\s*(.*)/
        let doubleValueReg = /^(.*?),\s*(.*)/

        // let reg 
        // let kvReg = /\s*(\w+)\:\s*(.*)/
        // rotate: false
        let info:any = {}
        let lastFrameName:string = ""
        for (let line of lines){
            if (info.png == null) {
                let matches = line.match(regPng)
                if (matches && matches.length > 0 ){
                    info['png'] = matches[1]
                    info['frames'] = {}
                }
            } else {
                let matches = line.match(headerKvReg)
                if (matches && matches.length > 0 ){
                    let k = matches[1]
                    let v = matches[2]
                    let vmatches = v.match(doubleValueReg)
                    if (vmatches && vmatches.length > 0) {
                        if (k != "format") {
                            info[k] = [parseFloat(vmatches[1]), parseFloat(vmatches[2])]
                        } else {
                            info[k] = [vmatches[1], vmatches[2]]
                        }
                    } else {
                        info[k] = v
                    }
                    continue
                }
                
                matches = line.match(regFrameName)
                if (matches && matches.length > 0 ){
                    lastFrameName = matches[1]
                    info['frames'][lastFrameName] = {}
                    continue
                }

                matches = line.match(kvReg)
                if (matches && matches.length > 0 ){
                    let k = matches[1]
                    let v = matches[2]
                    let vmatches = v.match(doubleValueReg)
                    if (vmatches && vmatches.length > 0) {
                        info['frames'][lastFrameName][k] = [parseFloat(vmatches[1]), parseFloat(vmatches[2])]
                    } else {
                        info['frames'][lastFrameName][k] = v
                    }
                    
                    continue
                }
            }
        }
        // console.log(info)
        this.atlasInfo = info
        this.createRegions()
    }

    protected createRegions() {
        let width = this.atlasInfo.size[0]
        let height = this.atlasInfo.size[1]
        for (let frameName in this.atlasInfo.frames) {
            let frame = this.atlasInfo.frames[frameName]
            let region = new AtlasRegion()
            this.regions[frameName] = region
            region.name = frameName
            region.x = frame.xy[0]
            region.y = frame.xy[1]
            region.width = frame.size[0]
            region.height = frame.size[1]
            region.originalWidth = frame.orig[0]
            region.originalHeight = frame.orig[1]
            region.offsetX = frame.offset[0]
            region.offsetY = frame.offset[1]
            region.u1 = region.x / width
            region.v1 = region.y / height
            region.u2 = (region.x + region.width) / width
            region.v2 = (region.y + region.height)/ height 
            region.uLen = region.u2 - region.u1
            region.vLen = region.v2 - region.v1
        }
        console.log(this.regions)
    }

    public getRegion(name:string) {
        return this.regions[name]
    }
}