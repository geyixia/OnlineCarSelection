import * as THREE from 'three'
// 定义一个灯光类
export class MyLight{
    constructor(scene){
        this.scene = scene
        // 四个平行光数据
        this.dirPosList=[
            [0, 5, 10],
            [-10, 5, 0],
            [0, 5, -10],
            [10, 5, 0],
        ]
        this.createCarDL()
    }
    // 创建照亮汽车的平行灯光
    createCarDL(){
        this.dirPosList.forEach(positionArr=>{
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
            directionalLight.position.set(...positionArr)
            this.scene.add(directionalLight)
        })
    }
}