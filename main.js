// 在线选车项目
import { camera } from '@/entry'

// three.js 光线投射统一管理类初始化
import { ClickHandler } from '@/utils/ClickHandler'
// 实现跨模块传参数
import { EventBus } from '@/utils/EventBus'
import './menu'


ClickHandler.getInstance().init(camera)
// 订阅事件
EventBus.getInstance().on('changePrice', (oldPrice, newPrice)=>{
    console.log(oldPrice,newPrice)
})
// 发布 触发事件
EventBus.getInstance().emit('changePrice', 100, 200)