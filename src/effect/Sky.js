import * as THREE from 'three'
import { DoubleSide } from 'three'
import { EventBus } from '@/utils/EventBus'
// 天空和地面管理类 背景
export class Sky{
    constructor(scene){
        this.scene=scene
        // 当前物体的背景对象列表
        this.nowMesh=[]
        this.nowSkyName = '展厅' // 默认当前场景名字
        this.init()
    }
    // 初始化天空
    init(){
        // 室内展厅的背景环境
        this.createInDoor()
        EventBus.getInstance().on('changeSky',skyName=>{
            // 每次切换都需要把原来的天空和地面清除掉
            if(this.nowSkyName ===skyName) return
            this.clear()
            if(skyName==='展厅'){
                this.createInDoor()
                this.nowSkyName = '展厅'
            } else if(skyName==='户外'){
                this.createOutDoor()
                this.nowSkyName = '户外'
            }
        })
    }
    // 户外场景的函数
    createOutDoor(){
         // 球体
         const sphereGeo = new THREE.SphereGeometry(40, 32, 16)
         const sphereTexture = (new THREE.TextureLoader()).load('image/desert.jpg')
         sphereTexture.colorSpace = THREE.SRGBColorSpace
         const material = new THREE.MeshBasicMaterial({
             map: sphereTexture,
             side: DoubleSide,
         })
         const sphere = new THREE.Mesh(sphereGeo, material)
         this.scene.add(sphere)
         this.nowMesh.push(sphere)
 
         // 地面 // 平面缓冲几何体
         const planeGeo = new THREE.CircleGeometry(20, 32, 16)
         // 投射阴影和光斑
         const planeTexture = (new THREE.TextureLoader()).load('image/sand.jpg')
         planeTexture.colorSpace = THREE.SRGBColorSpace
         const standardMaterial = new THREE.MeshStandardMaterial({
             map: planeTexture,
             color:0xa0825a,
             side: DoubleSide,
         }) // 颜色和颜色贴图可以混合计算
         const plane = new THREE.Mesh(planeGeo, standardMaterial)
         // 旋转到x轴
         plane.rotation.set(- Math.PI / 2, 0, 0)
         this.scene.add(plane)
         this.nowMesh.push(plane)
    }
    // 室内场景的函数
    createInDoor(){
        // 球体
        const sphereGeo = new THREE.SphereGeometry(10, 32, 16)
        const material = new THREE.MeshBasicMaterial({
            color: 0x42454c,
            side: DoubleSide,
        })
        const sphere = new THREE.Mesh(sphereGeo, material)
        this.scene.add(sphere)
        this.nowMesh.push(sphere)

        // 地面 // 平面缓冲几何体
        const planeGeo = new THREE.CircleGeometry(10, 32, 16)
        // 投射阴影和光斑
        const standardMaterial = new THREE.MeshStandardMaterial({
            color: 0x42454c,
            side: DoubleSide,
        })
        const plane = new THREE.Mesh(planeGeo, standardMaterial)
        // 旋转到x轴
        plane.rotation.set(- Math.PI / 2, 0, 0)
        this.scene.add(plane)
        this.nowMesh.push(plane)
    }
    // 清除球体和地面
    clear(){
        this.nowMesh.forEach(obj=>{
            obj.geometry.dispose()
            obj.material.dispose()
            // 如果还有纹理贴图
            obj.material.map && obj.material.map.dispose()
            obj.parent.remove(obj)
        })
        this.nowMesh.splice(0, this.nowMesh.length) // 清空数组
    }
}