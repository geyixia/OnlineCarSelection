// 点击事件管理类
import * as THREE from 'three'

export class ClickHandler{
    // 单例模式（静态/类方法）：这个类被调用n次也只会产生同一个实例对象 点击事件只有一个
    // 类方法只能由类调用，例如：ClickHandler.getInstance()
    static getInstance(){
        if(!this.instance){
            // 只有运行时第一次进入才会执行
            this.instance = new ClickHandler() // 实例化对象
        }
        return this.instance
    }
    init(camera){
        this.camera = camera
        this.list = [] // 光线投射交互计算的物体
        this.map = new Map() // key可以是three.js的物体（与点击要执行的回调函数一对一结构关系）

        //  window.click 光线投射交互
        //  光线投射用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）。
        const rayCaster = new THREE.Raycaster()
        // 记录坐标点
        const pointer = new THREE.Vector2()
        const app = document.querySelector('.app')
        window.addEventListener('click', e =>{
            // 转webGl坐标系
            pointer.x = (e.clientX / app.clientWidth) * 2 - 1
            pointer.x = -(e.clientY / app.clientHeight) * 2 + 1
            // 
            rayCaster.setFromCamera(pointer, this.camera)
            const list = rayCaster.intersectObjects(this.list)
            console.log('list',this.list,list)
            // 通过交互物体本身，去map中找到对应要执行的回调函数调用
            // 射线收集到的物体对象 obj.object才是three.js的物体对象
            list.forEach(obj => {
                const fn = this.map.get(obj.object)
                // 回调绑定点击事件函数体 
                fn(obj.object)
            });
        })
    }
    // 传入要点击物体和函数体
    addMesh(mesh, fn){
        this.list.push(mesh)
        this.map.set(mesh, fn)
        // console.log(this.map)
    }
}