import Spine from "./spine";
import SpineBezierUtils from "./spine-bezier-utils";
import SpineBone from "./spine-bone";
import { AnimationBoneJson, AnimationJson, AnimationBoneKeyFrameJson, AnimationKeyFrameJson, AnimationAttachmentKeyFrameJson, AnimationDeformFrameJson } from "./spine-data";
import { Attachment } from "./spine-mesh";

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

    
    public getCurrentTime():number {
        return this.currentTime
    }

    protected applyRotateInterFrameToBone(bone:SpineBone, frames:Array<AnimationBoneKeyFrameJson>, time:number) {
        let interFrame = this.getInterFrameFactor(frames, time)
        if (interFrame) {
            let startFrame = interFrame.start as AnimationBoneKeyFrameJson
            let endFrame = interFrame.end as AnimationBoneKeyFrameJson
            if (interFrame.factor == null){
                bone.rotation = this.getFrameValue(endFrame.angle, bone.setupPosValue.rotation)
            } else if (interFrame.start && interFrame.end) {
                let startValue = this.getFrameValue(startFrame.angle, bone.setupPosValue.rotation)
                let endValue = this.getFrameValue(endFrame.angle, bone.setupPosValue.rotation)
                bone.rotation = this.getInterValue(startValue, endValue, interFrame.factor, startFrame)
            }
        }     
    }

    protected applyTranslateInterFrameToBone(bone:SpineBone, frames:Array<AnimationBoneKeyFrameJson>, time:number) {
        let interFrame = this.getInterFrameFactor(frames, time)
        if (interFrame) {
            let startFrame = interFrame.start as AnimationBoneKeyFrameJson
            let endFrame = interFrame.end as AnimationBoneKeyFrameJson
            if (interFrame.factor == null){
                bone.x = this.getFrameValue(endFrame.x, bone.setupPosValue.x)
                bone.y = this.getFrameValue(endFrame.y, bone.setupPosValue.y)
            } else if (interFrame.start && interFrame.end) {
                let startValue = this.getFrameValue(startFrame.x, bone.setupPosValue.x)
                let endValue = this.getFrameValue(endFrame.x, bone.setupPosValue.x)
                bone.x = this.getInterValue(startValue, endValue, interFrame.factor, startFrame)

                startValue = this.getFrameValue(startFrame.y, bone.setupPosValue.y)
                endValue = this.getFrameValue(endFrame.y, bone.setupPosValue.y)
                bone.y = this.getInterValue(startValue, endValue, interFrame.factor, startFrame)
            }
        }
    }

    protected applyScaleInterFrameToBone(bone:SpineBone, frames:Array<AnimationBoneKeyFrameJson>, time:number) {
        let interFrame = this.getInterFrameFactor(frames, time)
        if (interFrame) {
            let startFrame = interFrame.start as AnimationBoneKeyFrameJson
            let endFrame = interFrame.end as AnimationBoneKeyFrameJson
            if (interFrame.factor == null){
                bone.scaleX = this.getFrameValue(endFrame.x, bone.setupPosValue.scaleX)
                bone.scaleY = this.getFrameValue(endFrame.y, bone.setupPosValue.scaleY)
            } else if (interFrame.start && interFrame.end) {
                let startValue = this.getFrameValue(startFrame.x, bone.setupPosValue.scaleX)
                let endValue = this.getFrameValue(endFrame.x, bone.setupPosValue.scaleX)
                bone.scaleX = this.getInterValue(startValue, endValue, interFrame.factor, startFrame)

                startValue = this.getFrameValue(startFrame.y, bone.setupPosValue.scaleY)
                endValue = this.getFrameValue(endFrame.y, bone.setupPosValue.scaleY)
                bone.scaleY = this.getInterValue(startValue, endValue, interFrame.factor, startFrame)
            }
        }
    }

    protected applyShearInterFrameToBone(bone:SpineBone, frames:Array<AnimationBoneKeyFrameJson>, time:number) {
        let interFrame = this.getInterFrameFactor(frames, time)
        if (interFrame) {
            let startFrame = interFrame.start as AnimationBoneKeyFrameJson
            let endFrame = interFrame.end as AnimationBoneKeyFrameJson
            if (interFrame.factor == null){
                bone.shearX = this.getFrameValue(endFrame.x, bone.setupPosValue.shearX)
                bone.shearY = this.getFrameValue(endFrame.y, bone.setupPosValue.shearY)
            } else if (interFrame.start && interFrame.end) {
                let startValue = this.getFrameValue(startFrame.x, bone.setupPosValue.shearX)
                let endValue = this.getFrameValue(endFrame.x, bone.setupPosValue.shearX)
                bone.shearX = this.getInterValue(startValue, endValue, interFrame.factor, startFrame)

                startValue = this.getFrameValue(startFrame.y, bone.setupPosValue.shearY)
                endValue = this.getFrameValue(endFrame.y, bone.setupPosValue.shearY)
                bone.shearY = this.getInterValue(startValue, endValue, interFrame.factor, startFrame)
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

    protected getInterValue(startValue:number, endValue:number,  t:number, curveFrame:AnimationKeyFrameJson){
        let curveType = curveFrame.curve
        if (curveType == "stepped") {
            return startValue
        } 
        else if (curveType != null) {
            //curve bezier-3, (c1, c2), (c3, c4)
            let c1 = parseFloat(curveType)
            let c2 = curveFrame.c2 || 0
            let c3 = curveFrame.c3 || 1
            let c4 = curveFrame.c4 || 1
            //cache samples
            if (curveFrame.cacheSamples == null) {
                curveFrame.cacheSamples = SpineBezierUtils.splitCurveToSamples([c1, c2, c3, c4], 10)
            } 
            let value= SpineBezierUtils.getInterValue(curveFrame.cacheSamples, t, startValue, endValue)   
            return value    
        }

        return startValue*(1-t) + endValue*t
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

    public getAttachmentName(slotName:string) :string | null{
        if (this.animationJson.slots == null){
            return ""
        }
        let slotAnimation = this.animationJson.slots[slotName]
        if (slotAnimation == null || slotAnimation.attachment == null){
            return ""
        }
        let interFrame = this.getInterFrameFactor(slotAnimation.attachment, this.currentTime)
        if (interFrame == null) {
            return null
        }
        let startFrame = interFrame.start as AnimationAttachmentKeyFrameJson
        let endFrame = interFrame.end as AnimationAttachmentKeyFrameJson
        if (interFrame.factor == null) {
            return endFrame.name
        }
        return startFrame.name
    }

    public applyDeform(skinName:string, slotName:string, attachment:Attachment) {
        if (this.animationJson.deform == null) {
            return
        }
        if (this.animationJson.deform[skinName] == null) {
            return
        }

        if (this.animationJson.deform[skinName][slotName] == null) {
            return
        }
        if (this.animationJson.deform[skinName][slotName][attachment.keyName] == null) {
            return
        }
        let frames = this.animationJson.deform[skinName][slotName][attachment.keyName]
        let interFrame = this.getInterFrameFactor(frames, this.currentTime)
        if (interFrame == null) {
            return
        }
        //setuppos mesh
        let setupVertices = attachment.setupVertices
        let startFrame = interFrame.start as AnimationDeformFrameJson
        let endFrame = interFrame.end as AnimationDeformFrameJson
        let finalVertices = [...setupVertices]
        //根据插值结果赋值给finalVertices, 最后把finalVertices赋值回attachment.vertices
        if (interFrame.factor == null) {
            //直接赋值
            let offset = endFrame.offset || 0
            let deforms = endFrame.vertices || []
            for (let o=offset;o<deforms.length;o++) {
                finalVertices[o] = this.getFrameValue(deforms[o-offset], finalVertices[o] )
            }
        } else{
            //插值
            let offset1 = startFrame.offset || 0 
            let deforms1 = startFrame.vertices || []
            let deformLen1 = deforms1.length
            let offset2 = endFrame.offset || 0
            let deforms2 = endFrame.vertices || []            
            let deformLen2 = deforms2.length
            let offset = Math.min(offset1, offset2)
            let offsetEnd = Math.max(offset1 + deformLen1, offset2 + deformLen2)
            for (let o=offset;o<offsetEnd;o++) {
                let startValue = finalVertices[o]
                let endValue = finalVertices[o]
                if (o >= offset1 && o <offset1 + deformLen1) {
                    startValue = this.getFrameValue(deforms1[o-offset1], finalVertices[o] )
                }
                if (o >= offset2 && o <offset2 + deformLen2) {
                    endValue = deforms2[o-offset2]
                    endValue = this.getFrameValue(deforms2[o-offset2], finalVertices[o] )
                }
                finalVertices[o] = this.getInterValue(startValue, endValue, interFrame.factor, endFrame)
            }
        }

        let index = 0
        if (attachment.isWeighted) {
            for (let vert of attachment.vertices) {
                let relatedBones = vert.relatedBones
                for (let boneInfo of relatedBones) {
                    boneInfo.x = finalVertices[index++]
                    boneInfo.y = finalVertices[index++]
                }
            }
        } else {
            for (let vert of attachment.vertices) {
                vert.x = finalVertices[index++]
                vert.y = finalVertices[index++]
            }
        }
    }
}