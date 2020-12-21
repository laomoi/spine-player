import Test from "./examples/test"
import TestSpine from "./examples/test-spine"
import Renderer from "./webgl/renderer"



export default class App {

    protected gl:WebGLRenderingContext

    protected webCallback:any = null

    protected renderer:Renderer = null
    protected width:number
    protected height:number
    // protected test:Test = new Test()
    protected test:TestSpine = new TestSpine()

    public setGL(gl:WebGLRenderingContext, width:number, height:number) {
        this.gl = gl
        this.width = width
        this.height = height
    }

    public run() {
        this.renderer = new Renderer()
        this.renderer.setGL(this.gl, this.width, this.height)

        let then = 0
        let lastShowFPS = 0
        let loopWrap = (now:number) => {
            now *= 0.001                        
            const deltaTime = now - then    
            if (then > 0 && deltaTime > 0 && this.webCallback != null) {
                if (now - lastShowFPS > 0.3) {
                    const fps = 1 / deltaTime  
                    this.webCallback("fps", fps)
                    lastShowFPS = now
                }
            }      
            then = now     
            this.loop()
            requestAnimationFrame(loopWrap)
        }

        loopWrap(0)
    }

    public setCallback(callback:any) {
        this.webCallback = callback
    }

    protected loop() {
        this.test.run(this.renderer)
    }


}