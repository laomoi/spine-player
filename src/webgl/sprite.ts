import Mesh from "./mesh"

export default class Sprite extends Mesh {
    public onTextureSet() {
        super.onTextureSet()
        this.points = [
            [0, this.texture.imageHeight, 0, 1],                //左上角 x, y, u, v
            [0, 0, 0, 0],                                       //左下角
            [this.texture.imageWidth, this.texture.imageHeight, 1, 1],  //右上角
            [this.texture.imageWidth, 0, 1, 0],                         //右下角
        ]
        this.indices = new Uint16Array([
            0, 1, 2,
            1, 3, 2
        ])
    }
}
