import * as THREE from 'three'
import { MySprite } from './MySprite'
import { ClickHandler } from '@/utils/ClickHandler'
import gsap from 'gsap'
import { EventBus } from '@/utils/EventBus'
// 汽车的公共类
export class Car{
    constructor(model, scene, camera, controls){
        this.model = model
        this.scene = scene
        this.camera = camera
        this.controls = controls

        // 车的小的模型对象
        this.carModel = {
            'body': {
                'main' :{ // 车身
                    name: 'Object_103',
                    model: {}, // 小物体对象
                },
                'roof' :{ // 车顶
                    name: 'Object_110',
                    model: {}, // 小物体对象
                },
                'leftDoor' :{ // 左车门
                    name: 'Object_64',
                    model: {}, // 小物体对象
                    mark:[
                        {
                            name: 'sprite',
                            url:'image/sprite.png',
                            scale:[0.2, 0.2],
                            position:[1.07, 1.94, -0.23]
                        }
                    ]
                },
                'rightDoor' :{ // 右车门
                    name: 'Object_77',
                    model: {}, // 小物体对象
                    mark:[
                        {
                            name: 'sprite',
                            url:'image/sprite.png',
                            scale:[0.2, 0.2],
                            position:[-1.05, 0.78, -0.23]
                        }
                    ]
                },
            },
            'glass': { // 玻璃
                'front': { // 前玻璃
                  name: 'Object_90',
                  model: {}
                },
                'leftGlass': { // 左玻璃
                  name: 'Object_68',
                  model: {}
                },
                'rightGlass': { // 右玻璃
                  name: 'Object_81',
                  model: {}
                }
              }
        }
        // 车数值相关（记录用于发给后台-保存用户要购车相关信息）
        this.info = {
            allPrice: 2444700, // 车整体默认总价
            color: [
            {
                name: '土豪金',
                color: '#ff9900',
                isSelected: true
            },
            {
                name: '传奇黑',
                color: '#343a40',
                isSelected: false
            },
            {
                name: '海蓝',
                color: '#409EFF',
                isSelected: false
            },
            {
                name: '玫瑰紫',
                color: '#6600ff',
                isSelected: false
            },
            {
                name: '银灰色',
                color: '#DCDFE6',
                isSelected: false
            }
            ],
            // 贴膜
            film: [
            {
                name: '高光',
                price: 0,
                isSelected: true
            },
            {
                name: '磨砂',
                price: 20000,
                isSelected: false
            }
            ]
        }
        // 汽车各种视角坐标对象
        this.positionObj = {
            // 主驾驶
            main: {
                camera: {
                    x: 0.36,
                    y: 0.96,
                    z: -0.16
                },
                controls: {
                    x: 0.36,
                    y: 0.87,
                    z: 0.03
                }
            },
            // 副驾驶位
            copilot: {
                camera: {
                    x: -0.39,
                    y: 0.87,
                    z: 0.07
                },
                controls: {
                    x: -0.39,
                    y: 0.85,
                    z: 0.13
                }
            },
            // 外面观察
            outside: {
                camera: {
                    x: 3,
                    y: 1.5,
                    z: 3
                },
                controls: {
                    x: 0,
                    y: 0,
                    z: 0
                }
            }
        }

        this.init()
        this.modifyCarBody()
        this.createDoorSprite()
    }
    // 初始化汽车
    init(){
        this.scene.add(this.model)
        // 通过数据结构名字找到小物体对象 保存到小物体中
        Object.values(this.carModel.body).forEach(obj=>{
            // 通过名字找到小物体
            const target = this.model.getObjectByName(obj.name)
            if(target){
                obj.model = target
            }
        })
        // 玻璃相关
        Object.values(this.carModel.glass).forEach(obj => {
            // 通过名字找到小物体
            obj.model = this.model.getObjectByName(obj.name)
        })
        // 订阅汽车修改颜色的事件和函数体
        EventBus.getInstance().on('changeCarColor',(colorStr)=>{
            Object.values(this.carModel.body).forEach(obj=>{
                obj.model.material.color = new THREE.Color(colorStr)
            })
            // 用户选择的颜色同步保存到数据库 this.info.color中标注用户选择的颜色
            this.info.color.forEach(obj=>{
                obj.isSelected = false
                if(obj.color === colorStr){
                    obj.isSelected = true
                }
            })
        })
        // 订阅汽车贴膜切换的效果
        EventBus.getInstance().on('changeCarCoat', coatName => {
            if (coatName === '高光') {
                Object.values(this.carModel.body).forEach(obj => {
                    obj.model.material.roughness = 0.5
                    obj.model.material.metalness = 1
                    obj.model.material.clearcoat = 1
                })
            } else if (coatName === '磨砂') {
                Object.values(this.carModel.body).forEach(obj => {
                    obj.model.material.roughness = 1
                    obj.model.material.metalness = 0.5 // 如果为 0 显得很假
                    obj.model.material.clearcoat = 0
                })
            }
    
            // 保存用户选择的贴膜类型
            Object.values(this.info.film).forEach(obj => {
                obj.isSelected = false
                if (obj.name === coatName) obj.isSelected = true
                // 为后面计算总价做准备
            })
        })
        // 订阅计算总价事件
        EventBus.getInstance().on('celPrice', () => {
            const filmTarget = this.info.film.find(obj => obj.isSelected)
    
            // 动态总价
            const celPrice = this.info.allPrice + filmTarget.price
            document.querySelector('.price>span').innerHTML = `¥ ${celPrice.toFixed(2)}`
        })
        EventBus.getInstance().on('changeCarAngleView', viewName=>{
            this.setCameraAnimation(this.positionObj[viewName])
        })

    }
    // 修改汽车的方法 物理网格材质 - 薄膜
    modifyCarBody(){
        const bodyMaterial = new THREE.MeshPhysicalMaterial({
            color:0xff9900,
            roughness: 0.5, // 粗糙程度
            metalness: 1, // 金属度 1
            clearcoat: 1, // 清晰度
            clearcoatRoughness: 0, // 清晰度的粗糙值 不粗糙
        })
        // 赋予给每个小物体上
        Object.values(this.carModel.body).forEach(obj=>{
            obj.model.material = bodyMaterial
        })
        // 改变玻璃渲染面
        Object.values(this.carModel.glass).forEach(obj => {
            obj.model.material.side = THREE.FrontSide // 前面渲染
        })
        // 车顶部两面渲染
        this.carModel.body.roof.model.material.side = THREE.DoubleSide
    }
    // 创建车门上的热点精灵物体
    createDoorSprite(){
        // 自定义合成数组
        const markList = [this.carModel.body.leftDoor, this.carModel.body.rightDoor]
        // 遍历创建
        markList.forEach(obj=>{
            obj.mark.forEach(smallObj=>{
                if(smallObj.name === 'sprite'){
                   const sprite =  new MySprite(smallObj)
                   obj.model.add(sprite)
                   // 为精灵物体进行射线交互的绑定
                   ClickHandler.getInstance().addMesh(sprite, (clickThreeObj)=>{
                    //    点击时触发这里的代码
                    // console.log(clickThreeObj.parent)// 父级目标车门
                    const targetDoor = clickThreeObj.parent.parent.parent
                        if(!targetDoor.userData.isOpen){
                            // targetDoor.rotation.set(Math.PI / 3, 0, 0)
                            this.setDoorAnimation(targetDoor,{x:Math.PI / 3})
                            targetDoor.userData.isOpen = true
                        }else{
                            // targetDoor.rotation.set(0, 0, 0)
                            this.setDoorAnimation(targetDoor,{x:0})
                            targetDoor.userData.isOpen = false
                        }
                   })
                }
            })
        })
    }
    // 车开门动画
    setDoorAnimation(mesh, obj){
        gsap.to(mesh.rotation,{
            x: obj.x,
            duration: 1,
            ease: 'power1.in'
        })
    }
    // 摄像机和轨道控制器动画
    setCameraAnimation(dataObj) {
        gsap.to(this.camera.position, {
            ...dataObj.camera,
            duration: 1,
            ease: 'power1.in'
        })
        gsap.to(this.controls.target, {
            ...dataObj.controls,
            duration: 1,
            ease: 'power1.in'
        })
    }
}