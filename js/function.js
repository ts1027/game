// 1.兼容类名函数
/* 通过类名方式获取元素
   getCLass(类名，获取范围)
   参数1   classname    类名
   参数2  obj    默认值  document
*/
function getClass(classname,obj){
	var obj=obj||document;         //如果不传左边的范围 右边无论真假都会传右边的值
	if(document.getElementsByClassName!=undefined){
		return obj.getElementsByClassName(classname);
	}else{
		var arr=[];
		var Elm=obj.getElementsByTagName("*");
		for(var i=0;i<Elm.length;i++){
			if(check(Elm[i].className,classname)){
				 arr.push(Elm[i]);
			}
		}
        return arr;
	}
}
// 解决多个类名的问题
/*
oldclass：多个类名     newclass：当前要获取的那个类名   
*/
function check(oldclass,newclass){
	var arr1=oldclass.split(" ");
	for(var i=0;i<arr1.length;i++){
		if(arr1[i]==newclass){
			return true;
		}
	}
	return false;
}


//2.兼容文本内容
/*
   参数1：对象     参数2：要添加的文本内容
*/
function getText(obj,val){  
	if(val==undefined){    //如果val值空要执行的语句
		if(obj.textContent==undefined){  //如果没有这个属性则就返回obj.innerText；
		     return obj.innerText;     //innerText:只支持IE6  和谷歌
		 }else{        //如果有obj.tectContent  则直接返回
		     return obj.textContent;
		 }
	}else{    //如果val的值不为空的话要执行的语句
		 if(obj.textContent==undefined){
		     obj.innerText=val;   //就把val值赋给obj.innerText;会直接修改了值  但是没有返回值
		 }else{
		     obj.textContent=val;  // textContent:ff  chrome   IE9-11  【IE6-8  不兼容】  
		 }
	}
    
}

// 3.行内样式和外部样式通用的获取方法
/*
 参数1：对象    参数2：属性
*/
function getStyle(obj,attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];   //只支持IE   attr是一个字符串  所以要用[]包住
	}else{
		return getComputedStyle(obj,null)[attr];
	}
}


//4.$函数 
/*
参数：  selector：对象  context:一个范围 
*/
function $(selector,context){
	if(typeof selector=="string"){
        context=context||document;
        if(selector.charAt(0)=="#"){
        	return document.getElementById(selector.substr(1));
        }
        if(selector.charAt(0)=="."){
        	 return getClass(selector.substring(1),context);
        }
        if(/^[a-zA-Z][a-zA-Z1-6]*$/.test(selector)){
        	return context.getElementsByTagName(selector);
        }
        if(/^<[a-zA-Z][a-zA-Z1-6]{0,10}>$/.test(selector)){   //创建一个新的标签
        	return document.createElement(selector.slice(1,-1));   
        	//返回的是从document下创建的标签名  【slice(1,-1)：截取到尖括号里的内容】
        }
	}
	if(typeof selector=="function"){   //检测selector是不是一个函数   如果是则执行下边的代码
		on(window,"load",selector);
		// window.onload=function(){
		// 	selector();   //因为在此刻selector是一个函数，然后再调用函数 
		// }
	}
}


//5.获取元素子节点
// 参数：obj 父元素  type：范围
// a:不需要文本
// b：需要文本
function getChilds(obj,type){
	var childs=obj.childNodes;  //获取到父元素下所有的子节点
	var arr=[];
	type=type||"n";   //默认为不需要文本  
	for(var i=0;i<childs.length;i++){   //遍历所有的子节点
		if(type=="n"){  //如果不需要文本的时候
			if(childs[i].nodeType==1){  //如果每个子节点的nodetype类型为1时 则获取到标签名
			     arr.push(childs[i]);
	    	}
		}
		else if(type=="y"){    //需要获取到文本的时候
			if(childs[i].nodeType==1||(childs[i].nodeType==3 && trim(childs[i].nodeValue)!="")){ 
			  //判断某个节点的nodeType==1（标签节点） ||  某个节点的nodetype==3（是文本节点）并且 它的值不等于空的时候
			     arr.push(childs[i]);
	    	}
		}
	}
	return arr;
}

// 去除字符串两端的空格
// 参数：str字符串  type：范围
// a:去掉所有的空格 
// l:去掉左边的空格   
// r：去掉右边的空格    
// lr：去掉左右两边的空格
// 正则：^开始 $结束 \s空格  g全局匹配
function trim(str,type){   
	type=type||"lr";   //默认值为lr
	if(type=="a"){
		return str.replace(/\s*/g,"");
	}
	if(type=="l"){
		return str.replace(/^\s*/g,"");
	}
	if(type=="r"){
		return str.replace(/\s*$/g,"");
	}
	if(type=="lr"){
		return str.replace(/^\s*|\s*$/g,"");
	}
}


// 6.获取第一个子节点
function getFirst(obj,type){
	return getChilds(obj,type)[0];
}
//7.获取当中的任何一个节点
function getNum(obj,index,type){
    var num=getChilds(obj,type);  //所有的子节点
    return num[index];
}
//8.获取最后一个子节点  
function getLast(obj,type){
	var last=getChilds(obj,type);
	return getChilds(obj,type)[last.length-1];
}

//9.获取下一个兄弟节点
function getNext(obj){  //对象
	var next=obj.nextSibling;   //获取对象的的下一个子节点
	if(next==null){   //如果子节点为空的话 
		return false;   //则返回false   {如果此刻不返回一个值  则会报错}
	}
	while(next.nodeType==8 || (next.nodeType==3 && trim(next.nodeValue)=="")){
		//条件是如果是注释节点  或者  是文本节点（文本节点的值为空） 的话  里边的内容会一直寻找它的下一个节点
		next=next.nextSibling;
		if(next==null){  //如果下一个兄弟节点为空的话   就直接返回false；
			return false;
		}
	}
	return next;
}

//10.获取上一个兄弟节点
function getUp(obj){
	var top=obj.previousSibling;
	if(top==null){
		return false;
	}
	while(top.nodeType==8 && (top.nodeType==3&&trim(top.nodeValue)=="")){
		if(top==null){
			return false;
		}
		top=top.previousSibling;
	}
	return top;
}

// 11.插入一个对象之后
/*
   参数:obj1: 要插入的对象
        obj2：要插入谁之前
*/
function insertAfter(obj1,obj2){
	var next=getNext(obj2); 
	if(next==false){   //如果getNext函数中下一个为空的话  返回结果为false
		obj2.parentNode.appendChild(obj1);   //当没有下一个的话  就直接插入到
		return;
	}
	next.parentNode.insertBefore(obj1,next);
}

//12.插入一个对象之前
/*
	obj1:要插入的对象
	obj2:要插入谁之后的对象
*/
function insertBefore(obj1,obj2){
	var childs=obj2.parentNode;
	childs.insertBefore(obj1,obj2)
}


/*
	13、给同一个事件绑定多个处理程序
	参数   obj：对象    event：事件   fn：处理程序
*/
function on(obj,event,fn){
	if(obj.addEventListener){
		obj.addEventListener(event,fn,false);
	}else{
		obj.attachEvent("on"+event,fn)
	}
}

/*
	14、给同一个事件绑清除多个处理程序
	参数   obj：对象    event：事件   fn：处理程序
*/
function off(obj,event,fn){
	if(obj.removeEventListener){
		obj.removeEventListener(event,fn,false);
	}else{
		obj. detachEvent("on"+event,fn);
	}
}

/*
	15.滚轮事件
	obj 对象   upcallback:向上    downcallback向下
*/
function mouseWheel(obj,upcallback,downcallback){
	if(obj.addEventListener){
		obj.addEventListener("mousewheel",scrollFn,false);    //chrome,safari -webki
		obj.addEventListener("DOMMouseScroll",scrollFn,false);	//firefox -moz
	}else{
		obj.attachEvent("onmousewheel",scrollFn); //IE、 opera
	}
	function scrollFn(e){
		var ev=e||window.event;
		val=ev.wheelDelta||ev.detail;

		document.title=val;
		if(val==120||val==-3 ||val==-1){   //向上 火狐 -3
			upcallback&&upcallback.call(obj); 
			/*对象的冒充：如果不冒充的话  this指向window    让对象冒充 使this指向obj*/
			// document.title=val;
		}
		if(val==-120||val==3||val==1){		//向下
			downcallback&&downcallback.call(obj);
		}
		//阻止浏览器的默认动作
		if(ev.preventDefault){
			ev.preventDefault(); //阻止默认浏览器动作(W3C)
		}else{
			ev.returnValue = false
		}
	}
		
}

/*
	16.
*/
//判断某个元素是否包含有另外一个元素
function contains (parent,child) {//返回 true  parent 包含 child    返回false 不是包含关系
	if(parent.contains){//如果对象支持contains
		// 如果  父对象 包含 子对象   并且  父对象不等于 子对象 返回 true 
		return parent.contains(child) && parent!=child;
	}else{
		//父对象 包含 子对象  16   父对象 在子对象之前 4  = 20
		return (parent.compareDocumentPosition(child)===20);
	}
}
//判断鼠标是否真正的从外部移入，或者是真正的移出到外部；
function checkHover (e,target) {
	//target 对象 
	if(getEvent(e).type=="mouseover"){
		return !contains(target,getEvent(e).relatedTarget || getEvent(e).fromElement)&&
			!((getEvent(e).relatedTarget || getEvent(e).fromElement)===target)
	}else{
		return !contains(target,getEvent(e).relatedTarget || getEvent(e).toElement)&&
			!((getEvent(e).relatedTarget || getEvent(e).toElement)===target)
	}
}

/*
  hover(obj,overfun,outfun)  鼠标移入移除事件 
  obj   要操作的对象
  overfun   鼠标移入需要处理的函数
  outfun     鼠标移除需要处理的函数
*/
function hover (obj,overfun,outfun) {
	if(overfun){
	    obj.onmouseover=function  (e) {
			if(checkHover(e,obj)){
				overfun.call(obj);
			}
	    }
	}
	if(outfun){
		obj.onmouseout=function  (e) {
			if(checkHover(e,obj)){
				outfun.call(obj);
			}
	    }
	}
}

//获得事件对象
function getEvent (e) {
	return e||window.event;
}