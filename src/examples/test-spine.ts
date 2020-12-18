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

        let jsonFile = path.join(__dirname, "../../res/skeleton.json")
        let spineData = new SpineData()
        spineData.fromJson(SpineUtils.readJsonFile(jsonFile))
        let spine = new Spine(spineData)
        spine.setAnimation("animation")
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