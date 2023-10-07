import * as THREE from 'three'
import { EventBus } from '@/utils/EventBus'
// 定义一个灯光类
export class MyLight{
    constructor(scene){
        this.scene = scene
        this.nowSpotLight = {} // 聚光灯光源对象
        this.nowSceneName = '展厅'

        // 四个平行光数据
        this.dirPosList=[
            [0, 5, 10],
            [-10, 5, 0],
            [0, 5, -10],
            [10, 5, 0],
        ]
        this.createCarDL()
        this.createSpotLight()
        EventBus.getInstance().on('changeSky', sceneName => {
            if (this.nowSceneName === sceneName) return
            if (sceneName === '展厅') {
                this.createSpotLight()
            } else if (sceneName === '户外') {
                this.removeSportL()
            }
    
            this.nowSceneName = sceneName // 把当前点击的场景名字保存一下
        })
    }
    // 创建照亮汽车的平行灯光
    createCarDL(){
        this.dirPosList.forEach(positionArr=>{
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
            directionalLight.position.set(...positionArr)
            this.scene.add(directionalLight)
        })
    }
    // 创建聚光灯
    createSpotLight(){
        this.nowSpotLight = new THREE.SpotLight(0xffffff, 1)
        // 设置聚光灯光源角度（0 - Math.PI / 2）
        this.nowSpotLight.angle = 0.16 * Math.PI
        // 光的衰减程度（0 - 1）
        this.nowSpotLight.penumbra = 0.8
        // 开启阴影支持
        this.nowSpotLight.castShadow = true
    
        this.nowSpotLight.shadow.mapSize.set(4096, 4096) // 阴影贴图大小宽高
        this.nowSpotLight.position.set(0, 5, 0)
        this.scene.add(this.nowSpotLight)
    }
    // 删除聚光灯
    removeSportL() {
        this.nowSpotLight.parent.remove(this.nowSpotLight)
        this.nowSpotLight = {}
    }

}