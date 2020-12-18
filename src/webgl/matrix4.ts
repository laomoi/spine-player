export default class Matrix4 {
    //默认是列向量排布方式
    private _v: Float32Array = new Float32Array(16)

    constructor() {
        this._v = new Float32Array(16)
        this.identify()
    } 

    public get value():Float32Array {
        return this._v
    }

    public setValues(val:number){
        for (let i=0;this._v.length<4;i++) {
            this._v[i] = val
        }
    }

    public setValue(i:number, j:number, val:number){
        this._v[j*4+i] = val
    }

    public identify(){
        this.setValues(0)
        this.setValue(0, 0, 1)
        this.setValue(1, 1, 1)
        this.setValue(2, 2, 1) 
        this.setValue(3, 3, 1) 
    }

    public setOrg(width:number, height:number) {
        this.setValue(0, 0, 2/width)
        this.setValue(1, 1, 2/height)
        this.setValue(0, 3, -1)
        this.setValue(1, 3, -1)
    }
}