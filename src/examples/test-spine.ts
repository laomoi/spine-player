import Renderer from "../webgl/renderer"
import fs = require("fs")
import path = require("path")
import Spine from "../core/spine"
import SpineData from "../core/spine-data"
import SpineUtils from "../core/spine-utils"
import SpineAtlas from "../core/spine-atlas"

export default class TestSpine {
    
    private _inited:boolean =false

    protected spines:Array<Spine> = []
    
   

    protected init(renderer:Renderer) {
        renderer.enableBlend()
        renderer.setAlphaBlendMode()

        let jsonFile = "goblins-pro.json"// goblins-pro
        let atlasFile = "goblins-pro.atlas"
        let pngFile = "goblins-pro.png"

        let spineData = new SpineData()
        spineData.setJson(SpineUtils.readJsonFile(jsonFile))

        let spineAtlas = new SpineAtlas(atlasFile, pngFile, renderer)

        for (let i=0;i<1;i++) {
            let spine = new Spine(spineData)
            spine.setAnimation("walk")
            spine.createMesh(renderer, spineAtlas) //不生成Mesh也可以，只展示骨骼动画，没有skin
            // spine.createDebugMesh(renderer)

            spine.x = 150 + 2*i
            spine.y = 100
            this.spines.push(spine)
        }
        
        // let samples = SpineBezierUtils.splitCurveToSamples([0, 0.25, 0.75, 1.0 ], 10)
        // let value = SpineBezierUtils.getInterValue(samples, 0.2, 1, 10)
        // console.log(value)
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