// 整个 three.js 项目-单击事件管理类
import * as THREE from 'three'
export class ClickHandler {
  // 单例模式（静态/类方法）: 这个类被调用 n 次也只会产生同一个实例对象
  // 类方法只能由类调用，例如：ClickHandler.getInstance()
  static getInstance() {
    if (!this.instance) {
      // 只有运行时：第一次才会进入
      this.instance = new ClickHandler() // 实例化对象
    }

    return this.instance
  }
  init(camera) {
    this.camera = camera
    this.list = [] // 光线投射交互计算的物体
    this.map = new Map() // key 可以是 three.js 物体（与点击要执行的回调函数产生一对一关系）

    // 光线投射
    const rayCaster = new THREE.Raycaster()
    
    const pointer = new THREE.Vector2()
    const app = document.querySelector('.app')
    window.addEventListener('click', e => {
      pointer.x = (e.clientX / app.clientWidth) * 2 - 1
      pointer.y = -(e.clientY / app.clientHeight) * 2 + 1

      rayCaster.setFromCamera(pointer, this.camera)
      const list = rayCaster.intersectObjects(this.list)
      // 通过交互物体本身，去 map 中找到对应要执行的回调函数调用
      // obj 是射线收集到的数据对象，obj.object 才是 three.js 物体对象
      list.forEach(obj => {
        const fn = this.map.get(obj.object)
        // 回调绑定点击事件函数体，并回传当前触发的这个 three.js 物体
        fn(obj.object)
      })
    })
  }
  // 传入要点击物体和函数体
  addMesh(mesh, fn) {
    this.list.push(mesh)
    this.map.set(mesh, fn)
  }
}