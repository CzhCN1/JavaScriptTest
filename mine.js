/**
 * [eventUtil  跨浏览器的事件处理对象]
 * Czh 2016-02-02
 */
var eventUtil = {

	/**
	 * [getEvent 获取并返回事件]
	 * @param  {[type]} event [触发事件]
	 *
	 * @return {[type]}       [各浏览器兼容的事件形式]
	 */
	getEvent: function  (event) {
		return event ? event : window.event;			//DOM事件？DOM事件：IE事件
	},

	/**
	 * [getTarget 获取并返回事件目标]
	 * @param  {[type]} event [触发事件]
	 *
	 * @return {[type]}       [事件目标]
	 */
	getTarget: function  (event) {
		return event.target ? event.target : event.srcElement;		//DOM事件？DOM事件：IE事件
	},

	/**
	 * [addHandler 为对象绑定事件]
	 * @param {[type]} element   [事件所绑定的对象]
	 * @param {[type]} eventType [事件的类型]
	 * @param {[type]} handler   [事件回调函数]
	 */
	addHandler: function (element, eventType, handler) {
		if (element.addEventListener) {				//DOM2级事件处理(不支持IE)
			//false为事件冒泡
			element.addEventListener(eventType, handler, false);
		} else if(element.attachEvent){				//IE事件处理
			element.attachEvent('on' + eventType, handler);
		} else {										//DOM0级事件处理
			element['on' + eventType] = handler;
		}
	},

	/**
	 * [removeHandler  移除对象上指定的事件]
	 * @param {[type]} element   [事件所绑定的对象]
	 * @param {[type]} eventType [事件的类型]
	 * @param {[type]} handler   [事件回调函数]
	 */
	removeHandler: function(element, eventType, handler){
		if (element.addEventListener) {				//DOM2级事件处理(不支持IE)
			//false为事件冒泡
			element.removeEventListener(eventType, handler, false);
		} else if(element.attachEvent){				//IE事件处理
			element.detachEvent('on' + eventType, handler);
		} else {										//DOM0级事件处理
			element['on' + eventType] = null;
		}
	},

	/**
	 * [cancelBubble 阻止事件冒泡]
	 * @param {[type]} event [触发事件]
	 */
	cancelBubble: function (event) {
		if(event.stopPropagation){
			event.stopPropagation();				//DOM中的阻止事件冒泡
		}else{
			event.cancelBubble = true;				//IE中的阻止事件冒泡
		}
	},

	/**
	 * [preventDefault  阻止事件的默认行为]
	 * @param  {[type]} event [触发事件]
	 */
	preventDefault: function (event){
		if(event.preventDefault){
			event.preventDefault();					//DOM中的阻止事件的默认行为
		}else{
			event.returnValue = false;				//IE中的阻止事件的默认行为
		}
	},

	/**
	 * [ready DOM树生成后立即执行]
	 * @param  {Function} fn [需执行的函数]
	 */
	ready: function (fn){
		//定义DOM树加载完成后执行的函数
		var completed = function(event){
			//确认DOM树加载完成 或 页面加载完成
			if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ){
			//清除事件
				if ( document.addEventListener ) {
		                	document.removeEventListener( "DOMContentLoaded", completed, false );
		                	window.removeEventListener( "load", completed, false );
		            	} else {
		                	document.detachEvent( "onreadystatechange", completed );
		                	window.detachEvent( "onload", completed );
		            	}
		            	//执行ready后的回调函数
		            	fn();
			}
		};

		//非IE浏览器
		if(document.addEventListener){
			//DOM树加载完成
			document.addEventListener('DOMContentLoaded', completed, false);
			//页面加载完成会再执行一次回调函数
			window.addEventListener('load',completed,false);

		//IE浏览器
		}else{
			//IE浏览器，frame框架使用下面的方法
			//DOM树加载完成
			document.attachEvent( "onreadystatechange", completed );
			//页面加载完成会再执行一次回调函数
               	window.attachEvent( "onload", completed );

               	//IE浏览器，非frame框架
               	var top = false;
               	try{
               		//判断是否是frame框架
               		top = window.frameElement === null && document.documentElement;
               	}catch(e) {}

               	//不是frame框架则执行下面的方法
               	if(top && top.doScroll){
               		(function doScrollCheck(){
               			try {
                               	// Use the trick by Diego Perini
                               	// 如果DOM树加载未完成，执行doScroll方法将抛出错误
                               		top.doScroll("left");
	                       	} catch(e) {
	                       		return setTimeout( doScrollCheck, 50 );
	                      	}
	                            //清除事件
	                   		document.detachEvent( "onreadystatechange", completed );
		             	window.detachEvent( "onload", completed );
			     		//执行ready后的回调函数
			         	fn();
               		})();
               	}
		}
	},

};


/**
 * [query 常用的查询功能]
 * Czh 2016-02-04
 */
var query = {

	/**
	 * [getByClass 通过class查找元素]
	 * @param  {[type]} oParent   [在该元素的子元素中进行查找，默认为document。]
	 * @param  {[type]} className [需要查找的className]
	 *
	 * @return {[type]}           [返回带有指定类名的对象的集合]
	 */
	getByClass: function  (oParent, className) {
		oParent = oParent ? oParent : document;	//若未传入父元素，则在document下进行查找。
		var childList = oParent.getElementsByTagName('*');	//取得父元素下的所有子元素
		var result = [ ];
		//遍历所有子元素查询
		for(var i = 0; i<childList.length; i+=1){
			if(childList[i].className === className){
				result.push(childList[i]);				//若为所需的元素，将其压入result数组
			}
		}
		return result;								//返回最终结果
	},

	/**
	 * [getStyle 获取某对象的指定属性值]
	 * @param  {[type]} element [需要查询的对象]
	 * @param  {[type]} attr    [需要获取的属性]
	 *
	 * @return {[string]}         [返回属性值]
	 */
	getStyle: function (element, attr) {
		if(element.currentStyle){					//早期IE兼容
			return element.currentStyle[attr];
		}else{
			return getComputedStyle(element,null)[attr];
		}

	},
};


/**
 * [animate 常用的小动画]
 * Czh 2016-02-05
 */
var animate = {

	/**
	 * [move 简单的运动功能，改变高度、宽度、透明度、位置等属性]
	 * @param  {[type]}   obj   [目标对象]
	 * @param  {[json]}   attrs [需要改变的属性，及目标值(number,透明度的值为0~100)，并以json格式输入]
	 * @param  {Function} fn    [动作完成后执行的链函数(可选)]
	 */
	move: function  (obj,attrs,fn) {
		clearInterval(obj.timer);						//定时器初始化，将timer添加为对象的属性
		obj.timer = setInterval(function(){
			var stopFlag = true;						//结束标志
			for(var attr in attrs){
				// 获取内联样式当前值
				var currentValue = 0;				//保存当前的属性值
				if(attr == 'opacity'){
					currentValue = Math.round(parseFloat(query.getStyle(obj,attr))*100);
				}else{
					currentValue = parseInt(query.getStyle(obj,attr));
				}
				//计算动作的速度
				var speed = (attrs[attr] - currentValue) / 3;								//动作弹性变化
				speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
				//判断动作是否完成
				if(currentValue != attrs[attr]){
					stopFlag = false;
					//执行动作
					if(attr == 'opacity'){
						obj.style.filter = 'alpha(opacity:' + (currentValue + speed) + ')';	//IE浏览器
  						obj.style.opacity = (currentValue + speed ) / 100;					//非IE浏览器
					}else{
						obj.style[attr] = currentValue + speed + 'px';
					}
				}else{
					stopFlag = true;
				}
			}
			//动作已完成
			if(stopFlag){
				clearInterval(obj.timer);
				//判断是否有链函数
				if(fn){
					fn();
				}
			}
		},50);									//50ms定时器执行一次
	},


	/**
	 * [drag 简单的拖拽方法，可设定拖拽对象及范围对象。]
	 * @param  {[type]} obj   	[拖拽对象]
	 * @param  {[type]} oWrap	 [拖拽范围对象，若为空则默认为整个页面]
	 *
	 * 注意：obj的position属性必须为absolute，而oWrap对象必须为obj最近的已定位的祖先元素，否则会报错。
	 * 		为了尽量不影响原页面的布局，该脚本不进行position属性的修改。
	 */
	drag:function (obj, oWrap) {
		//为拖拽对象添加鼠标按下事件
		eventUtil.addHandler(obj, 'mousedown', function (event){
			//规则检测
			try{
				//检测该对象是否为绝对定位
				if(query.getStyle(obj,'position') != 'absolute'){
					throw "object's position not absolute";
				}
				//如果有oWrap参数进行检测  若没有则默认拖拽范围为整个页面
				var target = obj.parentNode;

				if(oWrap){
					//检测oWrap是否为obj最近的已定位祖先元素
					while(target.tagName != 'BODY'){
						if(target === oWrap){
							break;
						}else if(query.getStyle(target,'position')  != 'static'){
							throw "oWrap not the nearest located ancestor element";
						}
						target = target.parentNode;
					}
					//如果检测到body 说明oWrap不是obj的祖先元素
					if(target.tagName == 'BODY'){
						throw "oWrap not the obj's ancestor element";
					}
					//判断范围对象是否已定位
					//若未定位则不能作为偏移参照基准
					if(query.getStyle(oWrap,'position') == 'static'){
						throw "oWrap's position not located";
					}
				}else{
					while(target.tagName != 'BODY'){
						if(query.getStyle(target,'position')  != 'static'){
							throw "document not the nearest located ancestor element";
						}
						target = target.parentNode;
					}
				}
			}catch(err){
				//打印错误并结束
				console.log(err);
				return;
			}
			event = eventUtil.getEvent(event);
				//页面卷去的距离
			var scrollT = document.documentElement.scrollTop || document.body.scrollTop,
				scrollL = document.documentElement.scrollLeft || document.body.scrollLeft,
				//计算出鼠标在拖拽对象上的位置
				posX = event.clientX - obj.offsetLeft + scrollL,
				posY = event.clientY - obj.offsetTop + scrollT;

			//添加鼠标移动事件
			document.onmousemove = function (e){
				e = eventUtil.getEvent(e);

					//页面卷去的距离
				var 	scrollT = document.documentElement.scrollTop || document.body.scrollTop,
					scrollL = document.documentElement.scrollLeft || document.body.scrollLeft,
					//计算拖拽对象移动后距离页面顶部和左侧的距离
					disX = e.clientX - posX + scrollL,
					disY = e.clientY - posY + scrollT,
					//页面的宽度和高度
					winW = document.documentElement.scrollWidth || document.body.scrollWidth,
					winH = document.documentElement.scrollHeight || document.body.scrollHeight,
					//计算拖拽范围
					maxX = winW - obj.offsetWidth - 3,
					maxY = winH - obj.offsetHeight - 3,
					minX = 3,
					minY = 3;

				//如果有范围对象
				if(oWrap){
					//若有范围限制需要修改拖拽范围
					maxX = oWrap.offsetWidth - obj.offsetWidth - 3;
					maxY = oWrap.offsetHeight - obj.offsetHeight - 3;
				}

				//范围检测
				if(disX < minX){
					disX = minX;
				}else if(disX > maxX){
					disX = maxX;
				}
				if(disY < 0){
					disY = 0;
				}else if(disY > maxY){
					disY = maxY;
				}

				//移动拖拽对象
				obj.style.left = disX + 'px';
				obj.style.top = disY + 'px';
			};

			//松开鼠标卸载事件
			document.onmouseup = function(){
				document.onmousemove = null;
				document.onmouseup = null;
			};
		});

	},

};
