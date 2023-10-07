// 集中式的事件总线的类（订阅与发布的自定义事件）
export class EventBus {
    constructor(){
        // 绑定要触发的事件名和函数体们
        this.eventObj={

        }
    }
    static getInstance() {
        if (!this.instance) {
            // 只有运行时：第一次才会进入
            this.instance = new EventBus() // 实例化对象
        }
        return this.instance
    }
    // 订阅事件
    on(eventName, fn){
        if(!this.eventObj[eventName]){
            // 如果这个事件名字没有注册过，那就先声明此属性（事件名），赋予一个装入回调函数的数组
            this.eventObj[eventName] = []
        }
        this.eventObj[eventName].push(fn)
    }
    // 触发事件并传参
    emit(eventName, ...arg){
        // arg 此变量是一个数组（值就是按照先后顺序传入的实参）
        this.eventObj[eventName].forEach(fn => {
            fn(...arg) // 展开参数数组，按顺序一个个传递给回调函数
        })
    }

}