function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  // 这里秒钟也取整
  var second = parseInt(time)

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

var Util = {};
// 密码校验，6-20位字母,数字组合
Util.checkPassword = function (v) {
  var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
  if (reg.test(v)) {
    return true;
  }

  return false;
};

// 手机号校验
Util.checkPhone = function (v) {
  var reg = /^0{0,1}(13[0-9]|15[0-9]|18[0-9]|177)[0-9]{8}$/;
  if (reg.test(v)) {
    return true;
  }
  return false;
};

Util.isEmpty = function (v) {
  var val = v.trim();
  if (val == "" || val.length == 0) {
    return true;
  }
  return false;
};
Util.clearNoNum = function (obj) {
  obj.value = obj.value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
  obj.value = obj.value.replace(/^\./g, ""); //验证第一个字符是数字而不是
  obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
  obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
  obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
};

Util.format = function (date, fmt) { //author: meizz
  var o = {
    "M+": date.getMonth() + 1,                 //月份
    "d+": date.getDate(),                    //日
    "H+": date.getHours(),                   //小时
    "m+": date.getMinutes(),                 //分
    "s+": date.getSeconds(),                 //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o) if (new RegExp("(" + k + ")").test(fmt))
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};

module.exports = {
  formatTime: formatTime,
  Util : Util
}