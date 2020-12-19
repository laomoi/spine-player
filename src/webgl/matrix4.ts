export default class Matrix4 {
    //默认是列向量排布方式
    private _v: Float32Array = new Float32Array(16)

    constructor() {
        this._v = new Float32Array(16)
        this.identify()
    } 

    public get arrayValue():Float32Array {
        return this._v
    }

    public setValues(val:number){
        for (let i=0;this._v.length<4;i++) {
            this._v[i] = val
        }
    }

    public setArrayValue(v:Float32Array){
        for (let i=0;i<v.length;i++){
            this._v[i] = v[i]
        }
    }

    public setValue(i:number, j:number, val:number){
        this._v[j*4+i] = val
    }

    public getValue(i:number, j:number):number{
        return this._v[j*4+i]
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
        this.setTranslate(-1, -1)
    }

    public multiply(t:Matrix4, dst:Matrix4=null):Matrix4{
        if (dst == null){
            dst = new Matrix4()
        }
        for (let i=0;i<4;i++) {
            for (let j=0;j<4;j++) {
                let val = 
                  this.getValue(0, j) *  t.getValue(i, 0)
                + this.getValue(1, j) *  t.getValue(i, 1)
                + this.getValue(2, j) *  t.getValue(i, 2)
                + this.getValue(3, j) *  t.getValue(i, 3)
                dst.setValue(i, j, val)
            }
        }
        return dst
    }

    public setTranslate(x:number, y:number){
        this.setValue(0, 3, x)
        this.setValue(1, 3, y)
    }
  
}