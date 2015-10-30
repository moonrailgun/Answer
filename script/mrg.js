/**
 * Created by Chen on 2015-10-30.
 */

//随机颜色类
function GetRandomValFromArray(arr) {
    var length = arr.length;
    var random = Math.random();//[0,1)
    var index = Math.floor(random * length);//[0,length-1]
    return arr[index];
}
function GetRandomValColor(){
	//随机返回数组中的一个值
	var randomColorCls = ['default', 'primary', 'success', 'info', 'warning', 'danger', 'blue', 'pink', 'dark'];
    return GetRandomValFromArray(randomColorCls);
}