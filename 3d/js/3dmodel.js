/**
 * Created by kekodmc on 2017/3/10.
 */
var temp_cold=3;//低温临界值（危险）
var temp_cool=6;//低温警告
var temp_warm=24;//高温警告
var temp_hot=30;//高温临界值（危险）
//鼠标按下且移动时触发，
_init(dataJson);

//鼠标按住拖动旋转视角（数据加载完成后调用）
function move(){
    var body = document.querySelector("body");
    var box = document.querySelector("#box");
    var word = $(".floor div span");
    //var xNum =document.querySelector(".xNum");
    //var yNum =document.querySelector(".yNum");
    var x = -40,y = -0,z = 0;
    var xx = -40,yy = -0;
    var xArr = [],yArr = [];
    window.onmousedown = function (e) {//鼠标按下事件
        body.style.cursor = 'pointer';
        xArr[0] = e.clientX/2;//获取鼠标点击屏幕时的坐标
        yArr[0] = e.clientY/2;
        window.onmousemove = function (e) {//鼠标移动事件————当鼠标按下且移动时触发
            xArr[1] = e.clientX/2;//获取鼠标移动时第一个点的坐标
            yArr[1] = e.clientY/2;
            yy += xArr[1] - xArr[0];//获得鼠标移动的距离
            xx += yArr[1] - yArr[0];
            // xNum.value = xx+"°";//将所获得距离数字赋值给input显示旋转角度
            //yNum.value = yy+"°";
            //将旋转角度写入transform中
            box.style.transform = "rotatex("+xx+"deg) rotatey("+yy+"deg) rotatez(0deg) scale3d(0.7,0.7,0.7)";
            word.css('transform', 'rotateX(-90deg) rotateY('+-yy+'deg) translateY(-50px)');
            xArr[0] = e.clientX/2;
            yArr[0] = e.clientY/2;
        }

    };
    window.onmouseup = function () {//鼠标抬起事件————用于清除鼠标移动事件，
        body.style.cursor = 'default';
        window.onmousemove = null;
    }
}

//初始化模型
function _init(result) {
    if(result!=null||result!=''){
        var data=result.data;
        if(data.length>0){
            var list='';
            for(var i=0;i<data.length;i++){
                list+='<div class="floor" time="'+data[i].time+'" avg="'+data[i].avgTemp+'" ' +
                    'h_l_temp="'+data[i].maxTemp+'/'+data[i].minTemp+'" i_o_temp="'+data[i].inTemp+'/'+data[i].outTemp+'" ' +
                    'i_o_wet="'+data[i].inWet+'/'+data[i].outWet+'">';
                var area=data[i].area;
                if(area.length>0){
                    for(var j=0;j<area.length;j++){
                        list+=tempWarn(area[j].name,area[j].temperature);
                    }
                }
                list+='</div>';
            }
            $('#minbox').append(list);
            move();
        }
    }
}
/*  $(document).on('mouseover','.floor',function () {
 var name=$(this).attr('val1');
 var avg=$(this).attr('val2');
 var list='<li>楼层名称：'+name+'</li><li>平均温度：'+avg+'</li>';
 $('#ul_info').html(list);
 })*/

$(document).on('mouseover','.floor div',function () {
    var time=$(this).parent().attr('time');
    var avg=$(this).parent().attr('avg');
    var h_l_temp=$(this).parent().attr('h_l_temp');
    var i_o_temp=$(this).parent().attr('i_o_temp');
    var i_o_wet=$(this).parent().attr('i_o_wet');
    var area=$(this).attr('name');
    var temp=$(this).html();
    var list='<li>采样时间：<span class="val">'+time+'</span></li><li>平均温度：<span class="val">'+avg+'</span></li></li><li>最高/最低温度：<span class="val">'+h_l_temp+'</span></li><li>仓内/仓外温度：<span class="val">'+i_o_temp+'</span></li>'+
        '<li>仓内/仓外湿度：<span class="val">'+i_o_wet+'</span></li>';
    $('#ul_info').html(list);
});

//禁止选中文字
//IE6-9
document.body.onselectstart = document.body.ondrag = function(){
    return false;
}
//判断温度危险程度
function tempWarn(name,temp) {
    var list='';
    if(parseFloat(temp)){
        var c='';
        if(parseFloat(temp)>=temp_hot){
            c='area_hot';
        }else if(parseFloat(temp)>=temp_warm){
            c='area_warm';
        }else if(parseFloat(temp)<=temp_cold){
            c='area_cold';
        }else if(parseFloat(temp)<=temp_cool){
            c='area_cool';
        }else{
            c='area_safe';
        }
        list=  '<div class="'+c+'" name="'+name+'"><span>'+transToTemp(temp)+'</span></div>';
        return list;
    }else{
        return '<div class="area_safe" name="'+name+'"><span>'+temp+'</span></div>';
    }
}
//数字转成温度格式
function transToTemp(word) {
    word+='°';
    return word;
}