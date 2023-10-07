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