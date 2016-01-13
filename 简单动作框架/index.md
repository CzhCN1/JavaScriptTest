简单的动作框架，可修改某元素的宽、高、透明度、位置等。

语法：startMove(obj,json,fn){}

三个参数：obj, json ,fn

obj:需添加运动的元素,如：width,height,opacity,top...

json: {attr:target,attr:target,...} 同时运动的属性及目标值，目标值无需添加单位。

fn：(可选)链函数

用法实例：
 var div1=document.getElementById('div1');
 div1.onmouseover = function(){
      startMove(div1,{width:400},function(){
        startMove(div1,{height:200});
    });
 }
