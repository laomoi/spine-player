import Spine from "./spine";
import SpineBone from "./spine-bone";
import { AnimationBoneJson, AnimationJson, AnimationKeyFrameJson } from "./spine-data";

interface Interframe {
    start?: AnimationKeyFrameJson,
    end?:   AnimationKeyFrameJson,
    factor?: number
}

export default class SpineAnimation {
    public static ANIMATION_FPS:number = 60

    protected spine:Spine
    protected animationJson:AnimationJson

    protected currentTime:number = 0
    protected timePerUpdate:number = 1
    protected maxTime:number = 0
    
    constructor(spine:Spine, animationJson:AnimationJson) {
        this.spine = spine
        this.animationJson = animationJson
        this.timePerUpdate = 1 / SpineAnimation.ANIMATION_FPS
        this.maxTime = this.getMaxTimeOfAnimation(animationJson)
        this.updateAnimation()
    }

    public update() {
        this.currentTime += this.timePerUpdate
        if (this.currentTime >= this.maxTime) {
            this.currentTime = this.currentTime % this.maxTime
        }
        this.updateAnimation()
        
    }

    protected updateAnimation() {
        for (let boneName in this.animationJson.bones) {
            let boneAnimation = this.animationJson.bones[boneName]
            this.applyInterFrame(boneName, boneAnimation, this.currentTime)
        }
    }



    protected getFrameValue(delta:number, initValue:number) {
        if (delta == null){
            delta = 0
        }
        return initValue + delta
    }

    protected applyRotateInterFrameToBone(bone:SpineBone, frames:Array<AnimationKeyFrameJson>, time:number) {
        let interFrame = this.getInterFrameFactor(frames, time)
        if (interFrame) {
            if (interFrame.factor == null){
                bone.rotation = this.getFrameValue(interFrame.end.angle, bone.setupPosValue.rotation)
            } else if (interFrame.start && interFrame.end) {
                let startValue = this.getFrameValue(interFrame.start.angle, bone.setupPosValue.rotation)
                let endValue = this.getFrameValue(interFrame.end.angle, bone.setupPosValue.rotation)
                bone.rotation = this.getInterValue(startValue, endValue, interFrame.start.curve, interFrame.factor)
            }
        }
    }

    protected applyTranslateInterFrameToBone(bone:SpineBone, frames:Array<AnimationKeyFrameJson>, time:number) {
        let interFrame = this.getInterFrameFactor(frames, time)
        if (interFrame) {
            if (interFrame.factor == null){
                bone.x = this.getFrameValue(interFrame.end.x, bone.setupPosValue.x)
                bone.y = this.getFrameValue(interFrame.end.y, bone.setupPosValue.y)
            } else if (interFrame.start && interFrame.end) {
                let startValue = this.getFrameValue(interFrame.start.x, bone.setupPosValue.x)
                let endValue = this.getFrameValue(interFrame.end.x, bone.setupPosValue.x)
                bone.x = this.getInterValue(startValue, endValue, interFrame.start.curve, interFrame.factor)

                startValue = this.getFrameValue(interFrame.start.y, bone.setupPosValue.y)
                endValue = this.getFrameValue(interFrame.end.y, bone.setupPosValue.y)
                bone.y = this.getInterValue(startValue, endValue, interFrame.start.curve, interFrame.factor)
            }
        }
    }

    protected applyScaleInterFrameToBone(bone:SpineBone, frames:Array<AnimationKeyFrameJson>, time:number) {
        let interFrame = this.getInterFrameFactor(frames, time)
        if (interFrame) {
            if (interFrame.factor == null){
                bone.scaleX = this.getFrameValue(interFrame.end.x, bone.setupPosValue.x)
                bone.scaleY = this.getFrameValue(interFrame.end.y, bone.setupPosValue.y)
            } else if (interFrame.start && interFrame.end) {
                let startValue = this.getFrameValue(interFrame.start.x, bone.setupPosValue.scaleX)
                let endValue = this.getFrameValue(interFrame.end.x, bone.setupPosValue.scaleX)
                bone.scaleX = this.getInterValue(startValue, endValue, interFrame.start.curve, interFrame.factor)

                startValue = this.getFrameValue(interFrame.start.y, bone.setupPosValue.scaleY)
                endValue = this.getFrameValue(interFrame.end.y, bone.setupPosValue.scaleY)
                bone.scaleY = this.getInterValue(startValue, endValue, interFrame.start.curve, interFrame.factor)
            }
        }
    }

    protected applyShearInterFrameToBone(bone:SpineBone, frames:Array<AnimationKeyFrameJson>, time:number) {
        let interFrame = this.getInterFrameFactor(frames, time)
        if (interFrame) {
            if (interFrame.factor == null){
                bone.shearX = this.getFrameValue(interFrame.end.x, bone.setupPosValue.shearX)
                bone.shearY = this.getFrameValue(interFrame.end.y, bone.setupPosValue.shearY)
            } else if (interFrame.start && interFrame.end) {
                let startValue = this.getFrameValue(interFrame.start.x, bone.setupPosValue.shearX)
                let endValue = this.getFrameValue(interFrame.end.x, bone.setupPosValue.shearX)
                bone.shearX = this.getInterValue(startValue, endValue, interFrame.start.curve, interFrame.factor)

                startValue = this.getFrameValue(interFrame.start.y, bone.setupPosValue.shearY)
                endValue = this.getFrameValue(interFrame.end.y, bone.setupPosValue.shearY)
                bone.shearY = this.getInterValue(startValue, endValue, interFrame.start.curve, interFrame.factor)
            }
        }
    }

    protected applyInterFrame(boneName:string, animation:AnimationBoneJson, time:number) {
        let bone = this.spine.getBone(boneName)
        if (bone == null) {
            return
        }
        if (animation.rotate) {
            this.applyRotateInterFrameToBone(bone, animation.rotate, time)
        }

        if (animation.translate) {
            this.applyTranslateInterFrameToBone(bone, animation.translate, time)
        }
        
        if (animation.scale) {
            this.applyScaleInterFrameToBone(bone, animation.scale, time)
        }

        if (animation.shear) {
            this.applyShearInterFrameToBone(bone, animation.shear, time)
        }
    }

    protected getInterFrameFactor(frames:Array<AnimationKeyFrameJson>, time:number):Interframe{
        if (frames.length == 0){
            return null
        }
        let start = 0
        let end = frames.length-1
        if (time <= 0) {
            return {end:frames[start]}
        }
        let maxTime = frames[end].time || 0
        if (time >= maxTime) {
            return {end:frames[end]}
        }
        //二分查找
        while(start < end) {
            let mid = Math.floor((start + end )/2)
            let frame = frames[mid]
            let startTime = frame.time || 0
            let endTime = frames[mid+1].time || 0
            if (startTime <= time && time <= endTime) {
                return {start:frame, end:frames[mid+1], factor: (time-startTime) / (endTime-startTime)}
            }
            if (time < startTime) {
                end = mid
            } else if (time > endTime) {
                start = mid
            }
        }
        return null
    }

    protected getInterValue(startValue:number, endValue:number, curveType:string, factor:number){
        if (curveType == "stepped") {
            return startValue
        }
        return startValue*(1-factor) + endValue*factor
    }

    protected getMaxTimeOfAnimationBone(animation:AnimationBoneJson) {
        let maxTime = 0
        if (animation.rotate) {
            maxTime = Math.max(maxTime, animation.rotate[animation.rotate.length-1].time || 0)
        }
        if (animation.translate) {
            maxTime = Math.max(maxTime, animation.translate[animation.translate.length-1].time || 0)
        }
        if (animation.scale) {
            maxTime = Math.max(maxTime, animation.scale[animation.scale.length-1].time || 0)
        }
        if (animation.shear) {
            maxTime = Math.max(maxTime, animation.shear[animation.shear.length-1].time || 0)
        }
        return maxTime
    }

    protected getMaxTimeOfAnimation(animationJson:AnimationJson):number{
        let maxTime = 0
        for (let boneName in animationJson.bones) {
            let boneAnimation = this.animationJson.bones[boneName]
            maxTime = Math.max(maxTime, this.getMaxTimeOfAnimationBone(boneAnimation))
        }
        return maxTime
    }
}