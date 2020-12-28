import Mesh from "../webgl/mesh"
import Renderer from "../webgl/renderer"
import fs = require("fs")
import path = require("path")
import Shader, { DefaultShader } from "../webgl/shader"
import Sprite from "../webgl/sprite"
import Spine from "../core/spine"
import SpineAtlas from "../core/spine-atlas"
import SpineData from "../core/spine-data"
import SpineUtils from "../core/spine-utils"

export default class TestInstance {
    
    private _inited:boolean =false

    protected meshes:Array<Mesh> = []
    
  
    protected spines:Array<Spine> = []
    

    protected debugLabel:HTMLSpanElement
    protected paused:boolean = false

    protected init(renderer:Renderer) {
        renderer.enableBlend()
        renderer.setAlphaBlendMode()

        let jsonFile = "sp_shuicao.json"// goblins-pro
        let atlasFile = "sp_shuicao.atlas"
        let pngFile = "sp_shuicao.png"

        let spineData = new SpineData()
        spineData.setJson(SpineUtils.readJsonFile(jsonFile))

        let spineAtlas = new SpineAtlas(atlasFile, pngFile, renderer)

     
        for (let i=0;i<200;i++) {
            let spine = new Spine(spineData)
            spine.setAnimation("animation")
            spine.createMesh(renderer, spineAtlas)
            // spine.createDebugMesh(renderer)
            spine.x = 100 + Math.random()*700
            spine.y = 100 + Math.random()*500
            this.spines.push(spine)
        }
        
        this._inited = true

        this.addDebugUI(renderer)
    }

    public run(renderer:Renderer) {
        if (!this._inited) {
            this.init(renderer)
            
        }
        if (!this.paused){
            this.update(renderer)
        }
    }

    protected update(renderer:Renderer) {
        renderer.clear()
        for (let spine of this.spines) {
            spine.update()
        }

        for (let spine of this.spines) {
            spine.draw(renderer)
        }
    }

    protected addDebugUI(renderer:Renderer) {
        let self = this
        let debugElement = document.getElementById("debug")
        let button = document.createElement("Button")
        button.innerHTML = "单帧调试"
        let button2 = document.createElement("Button")
        button2.innerHTML = "暂停"

        let label = document.createElement("span")
        button.onclick = function() {
            self.update(renderer)
        }
        button2.onclick = function() {
            self.paused = true
        }

        debugElement.append(button)
        debugElement.append(button2)

        debugElement.append(label)
        this.debugLabel = label
    }
}