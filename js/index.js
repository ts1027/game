
function game(box,about,box1,btn3,fenshu,guan){
	this.about=about;  //点击要显示的盒子
	this.fenshu=fenshu; //分数
	this.guan=guan; //关
	this.box=box;
	this.box1=box1;  //中间的小盒子
	this.btn3=btn3;  //点击要显示的盒子
	this.arr=[];   //放字母的数组
	this.letterArr=["A","B","C","D","E","F","G","H","I","J","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V"];

	this.speed=5;  //速度
	this.num=4;  //放4个div

	this.level=1;   //  关卡
	this.score=0;   //分数
	this.life=10;	//生命

	this.cw=document.documentElement.clientWidth; //浏览器
	this.ch=document.documentElement.clientHeight;  //浏览器的高
	this.getLetter(4);
	this.play();
	this.key();
}
game.prototype={
	// 取字母
	getLetter:function(num){
		var that=this;
		for(var i=0;i<num;i++){
			var div=document.createElement("div");   Math.random()*400+200
			div.style.cssText="width:160px; height:80px;font-size:34px; color:#710503; text-align:center;line-height:84px;position:absolute;left:"+(Math.random()*(that.cw-600)+300)+"px;background: url(images/aa.png) no-repeat center center;background-size:cover;font-weight:600;top:"+((Math.random()*(-160))-80)+"px;margin:30px;";
			that.box.appendChild(div);
			this.arr.push(div);
			// alert(this.letterArr.length)
			div.innerHTML=this.letterArr[Math.floor(Math.random()*this.letterArr.length)];
		} 
	},
	// 玩
	play:function(){
		var that=this;
		var t=setInterval(move,220);
		function move(){
			if(that.arr.length<that.num){
				that.getLetter(that.num-that.arr.length)
			}
			for(var i=0;i<that.arr.length;i++){
				animate(that.arr[i],{top:that.arr[i].offsetTop+that.speed},500)
				if(that.arr[i].offsetTop+40>that.ch){
					that.box.removeChild(that.arr[i]);
					that.arr.splice(i,1);
					that.score--;
					that.fenshu.innerHTML=that.score;
					if(that.score<1){
						that.score=0;
					}
				}
			}
		}
		//点击要显示的盒子
		that.about.onclick=function(){
			that.box1.style.display="block";
			clearInterval(t);
		}
		that.btn3.onclick=function(){
			that.box1.style.display="none";
			t=setInterval(move,120);
		}
	},
	// 删除
	key:function(){
		var that=this;	
		document.onkeydown=function(e){
			var ev=e||window.event;
			for(var i=0;i<that.arr.length;i++){
				if(String.fromCharCode(ev.keyCode)==that.arr[i].innerHTML){
					that.box.removeChild(that.arr[i]);
					that.arr.splice(i,1);
					that.score++;
					that.fenshu.innerHTML=that.score;
					if(that.score>5){
						that.speed=40;
						that.guan.innerHTML=2;
					}
					if(that.score>11){
						that.speed=60;
						that.guan.innerHTML=3;
					}
					break;
				}
			}
			
		}
	}
}