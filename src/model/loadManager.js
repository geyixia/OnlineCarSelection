// 专门加载模型文件的

// 1、引入加载 gltf/glb 模型文件的加载器
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
// path路径 successFun接受成功的回调函数
export function loadManager(path, successFun){

    const gltfLoader = new GLTFLoader()
    gltfLoader.load(path,gltf=>{
        successFun(gltf.scene)
    }, process=>{
        // 打印加载进度
        // console.log(process)
    },error=>{
        throw new Error(error)
    })

}