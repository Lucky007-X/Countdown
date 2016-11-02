//设置全局变量
var Window_width=1024;
var Window_height=768;
var radius=8;	//圆的半径
var marginTop=60;	//表示每个数字距离画布上边距离
var marginLeft=30;	//表示第一个数字距离画布左边距离
// Date()函数中月份比较特殊,索引是从0开始的,10表示11月，endTime结束时间
//这里设置当前时间后的一个小时。
var endTime=new Date();
endTime.setTime(endTime.getTime()+3600*1000);
// 当前剩余多少秒
var curShowTimeSeconds=0;
// 声明一个小球的数组
var balls=[];
//声明一个小球颜色的数组,const 声明创建一个只读的常量
const colors=["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"]
//页面加载后的事件
window.onload=function(){
	//屏幕自适应
	Window_width=document.body.clientWidth;
	Window_height=document.body.clientHeight;

	//想要时间占整个屏幕的4/5,marginLeft的值就为1/10
	marginLeft=Math.round(Window_width/10);
	//因为时间所占的宽度是108*(radius+1)
	radius=Math.round(Window_width*4/5/108)-1;
	//marginTop占高度1/5
	marginTop=Math.round(Window_height/5);

	var canvas=document.getElementById("canvas");
	var context=canvas.getContext('2d');
	//调用变量的值,这样调用有两个好处:
	//1.屏幕的大小改变起来非常方便
	//2.后续在屏幕自适应的时候只需要计算全局变量的值
	canvas.width=Window_width;
	canvas.height=Window_height;

	curShowTimeSeconds=getCurrentShowTimeSeconds();
	setInterval(function(){
		render(context);
		update();
	},50)
}
//剩余时间的计算
function getCurrentShowTimeSeconds(){
	//当前时间
	var curTime=new Date();
	//剩余的毫秒数
	var ret=endTime.getTime()-curTime.getTime();
	//剩余的秒数,round()进行四舍五入取整
	ret=Math.round(ret/1000);

	return ret>=0 ? ret : 0;
}
// 数据的改变
function update(){
	//获取下一次剩余的时间
	var nextShowTimeSeconds=getCurrentShowTimeSeconds();
	var nextHours=parseInt(nextShowTimeSeconds/3600);
	var nextMinutes=parseInt((nextShowTimeSeconds-nextHours*3600)/60);
	var nextSeconds=nextShowTimeSeconds%60;

	//当前剩余的时间
	var curHours=parseInt(curShowTimeSeconds/3600);
	var curMinutes=parseInt((curShowTimeSeconds-curHours*3600)/60);
	var curSeconds=curShowTimeSeconds%60;
	//当前秒数不等于下一次的秒数
	if(nextSeconds!=curSeconds){
		//当前的小时的十位数不等于下一次的小时的十位数
		if(parseInt(curHours/10) != parseInt(nextHours/10)){
			//添加当前小时十位数的数字的小球
			addBalls(marginLeft+0,marginTop,parseInt(curHours/10));
		}
		//当前的小时的个位数不等于下一次的小时的个位数
		if(parseInt(curHours%10)!=parseInt(nextHours%10)){
			//添加当前小时个位数的数字的小球
			addBalls(marginLeft+15*(radius+1),marginTop,parseInt(curHours%10));
		}

		//当前的分钟的十位数不等于下一次的分钟的十位数
		if(parseInt(curMinutes/10)!=parseInt(nextMinutes/10)){
			//添加当前分钟十位数的数字的小球
			addBalls(marginLeft+39*(radius+1),marginTop,parseInt(curMinutes/10));
		}
		//当前的分钟的个位数不等于下一次的分钟的个位数
		if(parseInt(curMinutes%10)!=parseInt(nextMinutes%10)){
			//添加当前分钟个位数的数字的小球
			addBalls(marginLeft+54*(radius+1),marginTop,parseInt(curMinutes%10));
		}

		//当前的秒钟的十位数不等于下一次的秒钟的十位数
		if(parseInt(curSeconds/10)!=parseInt(nextSeconds/10)){
			//添加当前秒钟十位数的数字的小球
			addBalls(marginLeft+78*(radius+1),marginTop,parseInt(curSeconds/10));
		}
		//当前的秒钟的个位数不等于下一次的秒钟的个位数
		if(parseInt(curSeconds%10)!=parseInt(nextSeconds%10)){
			//添加当前秒钟个位数的数字的小球
			addBalls(marginLeft+93*(radius+1),marginTop,parseInt(curSeconds%10));
		}
		// 当前剩余的时间=下一次剩余的时间
		curShowTimeSeconds=nextShowTimeSeconds;
	}
	updateBalls();
	//计算小球的数量
	// console.log(balls.length);
}
//更新小球的移动
function updateBalls(){
	//给小球增加速度
	for(var i=0;i<balls.length;i++){
		balls[i].x+=balls[i].vx;
		balls[i].y+=balls[i].vy;
		balls[i].vy+=balls[i].g;
		//碰撞检测
		if(balls[i].y>=Window_height-radius){
			balls[i].y=Window_height-radius;
			balls[i].vy=-balls[i].vy*0.75;
		}
	}
	//画布中小球的数量
	var cnt=0;
	//判断小球是否滚出画面
	for (var i = 0; i < balls.length; i++) {
		// 当小球距离左边宽度大于0时,并且小球的距离右边的宽度小于画布的宽度时
		if(balls[i].x+radius>0 && balls[i].x-radius<Window_width)
		{
			// 由于在遍历的过程中,并非所有小球都满足这个if语句,所以i的索引一定是大于等于cnt的,由于cnt在不停的++,cnt是逐步的往上积累的,也就是说在这样的写法下,一旦我们发现了符合规则的小球,我们就把这样的小球挤在了前面,这样一来当整个循环结束以后，从0到cnt-1这cnt个小球都是留在画布里面的,而从cnt开始一直到balls.length-1这段长度里面的下小球就都是不在画布里面的小球了,当然在极端的条件下i=cnt,说明整个数组里面的小球都存在画布中
			balls[cnt++]=balls[i];
		}
	}
	//我们只需要前cnt个小球(也就是存在画布中的小球),cnt后面的小球都可以删掉
	//只要当前的数组的数量大于cnt,我们删除末尾的小球,为了优化计算机的性能,当cnt大于300时,取值为300,保证计算机制作小球的值,不超过300
	while(balls.length>Math.min(300,cnt)){  
		balls.pop();
	}
}
//添加小球
function addBalls(x,y,num){
	for (var i = 0; i < digit[num].length; i++) {
		for (var j = 0; j < digit[num][i].length; j++) {
			if(digit[num][i][j]==1){
				var aBall={
					x:x+j*2*(radius+1)+(radius+1),
					y:y+i*2*(radius+1)+(radius+1),
					//加速设置为1.5-2.5直接的随机数,这样会使小球更加活泼一些
					g:1.5+Math.random(),
					//x轴的速度等于-1的y次幂,y的值为0-1000的值,当y等于奇数时,vx=-4,当y等于偶数时,vx=4
					vx:Math.pow(-1,Math.ceil(Math.random()*1000))*4,
					//让小球有向上抛的动作
					vy:-5,
					//随机产生0-1的随机数*color的长度,向下取整
					colors:colors[Math.floor(Math.random()*colors.length)]
				}
				// 向数组的末尾添加一个或更多元素,并返回新的长度。
				balls.push(aBall);
			}
		}
	}
}
//绘制当前的canvas画布
function render(cxt){	//参数获取上下文环境
	//对一个矩形空间的图像进行刷新操作,防止图像重叠
	cxt.clearRect(0,0,Window_width,Window_height);

	//获取小时
	var hours=parseInt(curShowTimeSeconds/3600);
	//获取分钟	
	var minutes=parseInt((curShowTimeSeconds-hours*3600)/60);
	//获取秒
	var seconds=curShowTimeSeconds%60;
	//第一个数字的绘制
	renderDigit(marginLeft,marginTop,parseInt(hours/10),cxt);
	//第二个数字的绘制,因为每列的实心圆格子的宽度为2*(radius+1),每个数字每行有七列,每个数字的宽度为14*(radius+1),为每个数字之间添加间隙(radius+1),每个数字所占的宽度就是15*(radius+1)
	renderDigit(marginLeft+15*(radius+1),marginTop,parseInt(hours%10),cxt);
	//绘制冒号,冒号的点阵数组的索引为10
	renderDigit(marginLeft+30*(radius+1),marginTop,10,cxt);
	//绘制第三个数字,因为前面的图形是冒号,冒号每行有4列,所以冒号所占的宽度是9*(radius+1)
	renderDigit(marginLeft+39*(radius+1),marginTop,parseInt(minutes/10),cxt);
	// 绘制第四个数字
	renderDigit(marginLeft+54*(radius+1),marginTop,parseInt(minutes%10),cxt);
	// 绘制冒号
	renderDigit(marginLeft+69*(radius+1),marginTop,10,cxt);
	// 绘制第五个数字
	renderDigit(marginLeft+78*(radius+1),marginTop,parseInt(seconds/10),cxt);
	// 绘制第六个数字
	renderDigit(marginLeft+93*(radius+1),marginTop,parseInt(seconds%10),cxt);

	for (var i = 0; i < balls.length; i++) {
		cxt.fillStyle=balls[i].colors;

		cxt.beginPath();
		cxt.arc(balls[i].x,balls[i].y,radius,0,2*Math.PI,true);
		cxt.closePath();

		cxt.fill();
	}

}	
//绘制每个数字的方法
function renderDigit(x,y,num,cxt){	//确定绘制坐标,数字,绘制上下文环境
	cxt.fillStyle="rgb(0,102,153)";
	//i获取这个数字的第几行
	for(var i=0;i<digit[num].length;i++){
	//j获取这个数字的第几列
		for(var j=0;j<digit[num][i].length;j++){
			//digit[num][i][j]表示每行每列的值等于1时,绘制一个实心圆
			if(digit[num][i][j]==1){
				cxt.beginPath();
				//如何确定圆心的位置,看图2.png和图2解释说明
				cxt.arc(x+j*2*(radius+1)+(radius+1),y+i*2*(radius+1)+(radius+1),radius,0,2*Math.PI);
				cxt.closePath();
				cxt.fill();
			}
		}
	}

	
}
