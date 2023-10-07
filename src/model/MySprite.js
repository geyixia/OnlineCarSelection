// 专门产生精灵物体的类
// 车门的热点标记精灵类
// 跟着父级物体一起运动 需要添加到物体上
import * as THREE from 'three'
export class MySprite{
    constructor({ name, url, position, scale}){
        // 纹理加载
        const texture = (new THREE.TextureLoader()).load(url)
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture })
        const sprite = new THREE.Sprite(spriteMaterial)
        sprite.position.set(...position)
        sprite.scale.set(...scale)
        sprite.name = name
        // 直接返回精灵物体对象 而非new创造的空白对象
        return sprite
    }
}