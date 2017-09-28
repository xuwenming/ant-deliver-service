var MD5 = require('../../util/md5');
var app = getApp();
var requestList = {}; //api请求记录

// 将当前请求的api记录起来
function addRequestKey(key) {
  requestList[key] = true
}

// 将请求完成的api从记录中移除
function removeRequestKey(key) {
  delete requestList[key]
}

//当前请求的api是否已有记录
function hitRequestKey(key) {
  return requestList[key]
}

//根据请求的地址，请求参数组装成api请求的key,方便记录
function getRequestKey(data) {
  let ajaxKey = 'Method: ' + data.method + ',Url: ' + data.url + ',Data: '
  try {
    ajaxKey += JSON.stringify(data.data)
  } catch (e) {
    ajaxKey += data.data
  }
  return ajaxKey
}

function getUrl(url) {
  var tokenId = app.globalData.tokenId;
  if (tokenId)
    url += (url.indexOf("?") == -1 ? "?" : "&") + "tokenId=" + tokenId;
  return url;
}

function http(options) {
  if (!options || !options.url) throw Error('请求参数有误！');

  options.method = (options.method || 'GET').toUpperCase();
  options.contentType = options.contentType || 'application/json';

  //下面5行是对所有http请求做防重复请求处理，后面单独分享原理
  let ajaxKey = getRequestKey(options);
  if (hitRequestKey(ajaxKey)) {
    throw Error('重复提交请求：' + ajaxKey);
  }
  addRequestKey(ajaxKey);

  // 请求签名生成
  var params = '';
  if (options.data)
    for (var key in options.data) {
      if (params != '') params += "&";
      params += key + "=" + options.data[key];
    }
  if (params)
    params = 'tokenId=' + app.globalData.tokenId + "&" + params + app.globalData.tokenId;
  else
    params = 'tokenId=' + app.globalData.tokenId + app.globalData.tokenId;

  params = encodeURIComponent(params).replace(/[!]/g, "%21").replace(/[']/g, "%27")
    .replace(/[(]/g, "%28").replace(/[)]/g, "%29").replace(/[~]/g, "%7E");

  return wx.request({
    url: getUrl(options.url),
    data: options.data || {},
    method: options.method,
    header: {
      'content-type': options.contentType,
      'sign': MD5.md5(params)
    },
    success: function (res) {
      if (options.success)
        options.success(res.data);
    },
    fail: function (res) {
      console.log(options.url + '接口调用失败', res);
      if (options.fail)
        options.fail();
    },
    complete: function (res) {
      // 请求完成，释放记录的key，可以发起下次请求了
      removeRequestKey(ajaxKey);
      if (options.complete)
        options.complete();
    }
  })
}

function httpGet(options) {
  return http(options);
}

function httpPost(options) {
  options.method = 'POST';
  options.contentType = 'application/x-www-form-urlencoded';
  return http(options);
}

module.exports = {
  httpGet: httpGet,
  httpPost: httpPost
}