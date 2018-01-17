var app = getApp();
var config = require('../../../config');
var request = require('../../common/request');
var Util = require('../../../util/util').Util;

Page({
  data: {
    pageLoad: false,
    machineCode : null,
    autoPrint:false
  },
  onShow: function () {
    var self = this;
    request.httpPost({
      url: config.getShopApplyUrl,
      data:{t:new Date().getTime()},
      success: function (data) {
        if (data.success && data.obj) {
          self.setData({
            machineCode: data.obj.machineCode,
            autoPrint: data.obj.autoPrint
          });
        }
        self.setData({
          pageLoad: true
        });
      }
    })

  },

  scanBind:function(){
    var self = this;
    wx.scanCode({
      success: function (res) {
        if (res.errMsg == 'scanCode:ok' && res.scanType.toUpperCase() == 'QR_CODE') {
          var result = JSON.parse(res.result);
          if(result && result.machineCode) {
            wx.navigateTo({
              url: '/page/component/printer-bind/printer-bind?machineCode=' + result.machineCode,
            })
            // request.httpPost({
            //   url: config.speedAuUrl,
            //   data: { machineCode: result.machineCode, qrKey: result.qrKey},
            //   showLoading: true,
            //   success: function (data) {
            //     if (data.success) {
            //       self.setData({
            //         machineCode: result.machineCode
            //       });
            //       wx.showToast({
            //         title: "绑定成功",
            //         icon: 'success',
            //         mask: true,
            //         duration: 1500
            //       })
            //     } else {
            //       wx.showModal({
            //         content: data.msg,
            //         showCancel: false
            //       });
            //     }   
            //   }
            // })
          } else {
            wx.showModal({
              content: '二维码识别错误！',
              showCancel: false
            });
          }
        } else {
          wx.showModal({
            content: '扫码失败！',
            showCancel: false
          });
        }
      },
      fail: function (res) {
        if (res.errMsg != 'scanCode:fail cancel')
          wx.showModal({
            content: '扫码失败！',
            showCancel: false
          });
      }
    })
  },

  cancelPrint: function () {
    var self = this;
    wx.showModal({
      title: '提示',
      content: '是否确定取消所有未打印订单？',
      success: function (res) {
        if (res.confirm) {
          request.httpPost({
            url: config.cancelallUrl,
            showLoading: true,
            success: function (data) {
              if (data.success) {
                wx.showToast({
                  title: "取消完成",
                  icon: 'success',
                  mask: true,
                  duration: 2000
                })
              } else {
                wx.showModal({
                  content: data.msg,
                  showCancel: false
                });
              }
            }
          })
        }
      }
    })
  },

  shutdownPrint: function () {
    var self = this;
    wx.showModal({
      title: '提示',
      content: '是否确定打印机关机？',
      success: function (res) {
        if (res.confirm) {
          request.httpPost({
            url: config.shutdownrestartUrl,
            data: { responseType: 'shutdown' },
            showLoading: true,
            success: function (data) {
              if (data.success) {
                wx.showToast({
                  title: "关机成功",
                  icon: 'success',
                  mask: true,
                  duration: 2000
                })
              } else {
                wx.showModal({
                  content: data.msg,
                  showCancel: false
                });
              }
            }
          })
        }
      }
    })
  },

  switchChange: function (e) {
    request.httpPost({
      url: config.updateAutoPrintUrl,
      data: { autoPrint: e.detail.value },
      showLoading: true,
      success: function (data) {
        if (data.success) {
          wx.showToast({
            title: "更新成功",
            icon: 'success',
            mask: true,
            duration: 2000
          })
        }
      }
    })
  },
}) 