var app = getApp();
var loginUrl = require('../../config').loginUrl;
var Util = require('../../util/util').Util;

Page({
  data: {
    userName : {
      value : '',
      focus : true
    },
    vcodeMsg : '获取验证码'
  },
  onLoad: function (options){
    wx.login({
      success: function (data) {
        wx.request({
          url: loginUrl,
          data: {
            code: data.code
          },
          success: function (res) {
            console.log('登录成功', res);
            var data = res.data;
            if (data && data.success) {
              app.globalData.tokenId = data.obj;
              wx.switchTab({
                url: '../component/category/category',
              });
            } else {
              wx.setNavigationBarTitle({
                title: '注册'
              })
            }
          },
          fail: function (res) {
            console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res);
            wx.setNavigationBarTitle({
              title: '注册'
            })
          }
        });
      },
      fail: function (err) {
        console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err);
      }
    });
  },

  setUserName : function(e) {
    this.setData({
      userName: {
        value : e.detail.value,
        focus: true
      }
    });
  },

  getVCode : function(e) {
    var _this = this;
    var mobile = this.data.userName;
    console.log(mobile);
    if (!Util.checkPhone(mobile)) {
      wx.showModal({
        content: '请输入正确的手机号码',
        showCancel:false,
        success: function (res) {
          if (res.confirm) {
            _this.setData({
              userName: {
                focus: true
              }
            });
          }
        }
      })
      
      return;
    }
    wx.request({
      url: loginUrl,
      data: {
        mobile: mobile
      },
      success: function (res) {
        var data = res.data;
        if (data.success) {
          
        } else {

        }
      },
      fail: function (res) {
        console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res);
      }
    })
  },
  
  register : function(e){
    console.log('form发生了submit事件，携带数据为：', e);
  }
})