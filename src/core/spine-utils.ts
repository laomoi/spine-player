import fs = require("fs")
import path = require("path")

export default class SpineUtils {
    public static readJsonFile(file:string){
        let content = fs.readFileSync(file, "utf8")
        return JSON.parse(content)
    }
}