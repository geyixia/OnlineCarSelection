import * as THREE from 'three'
import { DoubleSide } from 'three'
// 天空和地面管理类 背景
export class Sky{
    constructor(scene){
        this.scene=scene
        // 当前物体的背景对象列表
        this.nowMesh=[]
        this.init()
    }
    // 初始化天空
    init(){
        // 室内展厅的背景环境
        this.createInDoor()
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
}