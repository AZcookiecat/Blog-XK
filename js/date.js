var now = new Date();
function createtime() {
  var grt= new Date("03/01/2025 00:00:00");
  now.setTime(now.getTime()+250);
  days = (now - grt ) / 1000 / 60 / 60 / 24; dnum = Math.floor(days);
  hours = (now - grt ) / 1000 / 60 / 60 - (24 * dnum); hnum = Math.floor(hours);
  if(String(hnum).length ==1 ){hnum = "0" + hnum;} minutes = (now - grt ) / 1000 /60 - (24 * 60 * dnum) - (60 * hnum);
  mnum = Math.floor(minutes); if(String(mnum).length ==1 ){mnum = "0" + mnum;}
  seconds = (now - grt ) / 1000 - (24 * 60 * 60 * dnum) - (60 * 60 * hnum) - (60 * mnum);
  snum = Math.round(seconds); if(String(snum).length ==1 ){snum = "0" + snum;}
  document.getElementById("timeDate").innerHTML = dnum+" 天 ";
  document.getElementById("times").innerHTML = hnum + " 时 " ;
}
setInterval("createtime()",250);

//定义
setInterval("fun(show_time)",1);
function fun(timeID){ 
var date = new Date();  //创建对象  
var y = date.getFullYear();     //获取年份  
var m =date.getMonth()+1;   //获取月份  返回0-11  
var d = date.getDate(); // 获取日  
var w = date.getDay();   //获取星期几  返回0-6   (0=星期天) 
var ww = ' 星期'+'日一二三四五六'.charAt(new Date().getDay()) ;//星期几
var h = date.getHours();  //时
var minute = date.getMinutes()  //分
var s = date.getSeconds(); //秒
var sss = date.getMilliseconds() ; //毫秒
if(m<10){
m = "0"+m;
}
if(d<10){
d = "0"+d;
}
if(h<10){
h = "0"+h;
}

if(minute<10){
minute = "0"+minute;
}

if(s<10){
s = "0"+s;
}

if(sss<10){
sss = "00"+sss;
}else if(sss<100){
sss = "0"+sss;
}

document.getElementById(timeID.id).innerHTML =  y+"-"+m+"-"+d+"   "+h+":"+minute+"     "+ww;
//document.write(y+"-"+m+"-"+d+"   "+h+":"+minute+":"+s);  
}

function updateClock() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('clock').textContent = `${year}年${month}月${day}日 ${hours}点${minutes}分`;
  }

  // 初始更新时钟
  updateClock();
  // 每分钟更新时钟
  setInterval(updateClock, 60000);