##**mine.js**  
　　一些常用的原生js方法，并考虑了浏览器的兼容问题，且不依赖于任何的现有库。目前包括三大类：事件类、查询类、动画类。
　　
####事件类：

 1. 获取事件 `eventUtil.getEvent(event)` 
 2. 获取事件目标`eventUtil.getTarget(event)`
 3. 为对象绑定事件 `eventUtil.addHandler(element，eventType，handler)`
 4. 移除对象上的指定事件 `eventUtil.removeHandler(element，eventType，handler)`
 5. 阻止事件冒泡 `eventUtil.cancelBubble(event)`
 6. 阻止事件默认行为 `eventUtil.preventDefault(event)`  
 7. 用于在当前文档结构载入完毕后立即执行指定的函数`eventUtil.ready(fn)`
   
####查询类：
 7. 通过class查找元素 `query.getByClass(oParent，className)`
 8. 获取对象的指定属性值 `query.getStyle(element，attr)`
  
####动画类:
 1. 简单的运动功能，改变高度、宽度、透明度、位置等属性`animate.move(obj,attrs,fn)`

 