// 汽车菜单 -dom事件绑定
import { EventBus } from '@/utils/EventBus'
const colorDivList = document.querySelectorAll('.col_group>div')
colorDivList.forEach(el => {
    el.addEventListener('click', () => {
      const colorStr = el.dataset.col
      // 颜色字符串 => 事件总线 => Car 类
      EventBus.getInstance().emit('changeCarColor', colorStr)
    })
})
// 贴膜切换
const coatDivList = document.querySelectorAll('.coat_group>div')
coatDivList.forEach(el => {
  el.addEventListener('click', () => {
    const coatName = el.dataset.co
    // 贴膜名字 => 事件总线 => Car 类
    EventBus.getInstance().emit('changeCarCoat', coatName)
    // 计算车最新价格
    EventBus.getInstance().emit('celPrice')
  })
})

// 场景切换
const sceneDivList = document.querySelectorAll('.scene_group>div')
sceneDivList.forEach(el => {
  el.addEventListener('click', () => {
    const sceneName = el.dataset.poi
    // 场景名字 => 事件总线 => Sky 类
    EventBus.getInstance().emit('changeSky', sceneName)
  })
})

// 视角切换
const lookDivList = document.querySelectorAll('.look_group>div')
lookDivList.forEach(el => {
  el.addEventListener('click', () => {
    const viewName = el.dataset.po
    // 视角名字 => 事件总线 => Car 类
    EventBus.getInstance().emit('changeCarAngleView', viewName)
  })
})
