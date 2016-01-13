function startMove (obj,json,fn) {	
	clearInterval(obj.timer);
    	obj.timer = setInterval(function(){  
    		var flag=true;
  		for(var attr in json){
  			// 获取内联样式当前值
  			var icur = 0;
  			if(attr == 'opacity'){
  				icur = Math.round(parseFloat(getStyle(obj,attr))*100);
  			}else{
  				icur = parseInt(getStyle(obj,attr));
  			}
  			//获取动作速度
  			var speed = (json[attr] - icur) / 2;
  			speed = speed>0?Math.ceil(speed):Math.floor(speed);
  			//检测停止
  			if (icur != json[attr]) {
  				flag = false;
  				//动作执行
  				if(attr == 'opacity'){
  					obj.style.filter= 'alpha(opacity:'+(icur+speed)+')';
  					obj.style.opacity = (icur+speed) / 100;
  				}else{
  					obj.style[attr]= (icur+speed)+'px' ;
  				}
  			}else{
  				flag = true;
  			}
  		}
  		if(flag){
  			clearInterval(obj.timer);
  			if(fn){
  				fn();
  			}
  		}
  	},50)
}

function getStyle(obj,attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}else{
		return getComputedStyle(obj,false)[attr];
	}
}