import Renderer from "../webgl/renderer"
import fs = require("fs")
import path = require("path")
import Spine from "../core/spine"
import SpineData from "../core/spine-data"
import SpineUtils from "../core/spine-utils"

export default class TestSpine {
    
    private _inited:boolean =false

    protected spines:Array<Spine> = []
    
    protected init(renderer:Renderer) {
        renderer.enableBlend()
        renderer.setAlphaBlendMode()

        let jsonFile = "hero_alva.json"
        let atlasFile = "hero_alva.atlas"
        let pngFile = "hero_alva.png"

        let spineData = new SpineData()
        spineData.setJson(SpineUtils.readJsonFile(jsonFile))

        let spine = new Spine(spineData)
        spine.setAnimation("attack02")
        spine.createMesh(renderer, atlasFile, pngFile) //不生成Mesh也可以，只展示骨骼动画，没有skin
        spine.x = 100
        spine.y = 100
        this.spines.push(spine)
        this._inited = true
    }

    public run(renderer:Renderer) {
        if (!this._inited) {
            this.init(renderer)
        }
        renderer.clear()

        for (let spine of this.spines) {
            spine.update()
        }

        for (let spine of this.spines) {
            spine.draw(renderer)
        }
    }
}