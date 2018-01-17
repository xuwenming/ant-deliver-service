// page/component/shop-manage/shop-manage.js
var config = require('../../../config');
var request = require('../../common/request');
var Util = require('../../../util/util').Util;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountInfo : {
      userName:'',
      avatarUrl: '/image/default_icon.png',
      shopName:'',
      shopStatus:'',
      validOrders:0,
      turnover:0
    },
    online:{
      type:'',
      online:0,
      name:''
    },
    pageLoad:false,

    animationData: "",
    showModalStatus: false,
    code:'',
    scanType:1,
    codePlaceholder:'请输入订单号',
    confirmBtn: {
      disabled: true
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  onShow:function(){
    this.setAccountInfo();
  },

  changeOnline:function(e){
    var self = this, online = self.data.online.online == 1 ? 0 : 1;
    if (self.data.online.frozen) return; // 冻结中
    request.httpPost({
      url: config.updateOnlineUrl,
      data: { online: online},
      showLoading: true,
      success: function (data) {
        if (data.success) {
          wx.showToast({
            title: online == 1 ? '营业中' : '停止营业',
            icon: 'success',
            mask: true,
            duration: 1000,
            complete: function () {
              self.setData({
                online: {
                  type: online == 1 ? 'yellow' : 'default',
                  online: online,
                  name: online == 1 ? '营业中' : '停止营业'
                }
              });
            }
          })
        }
      }
    })
  },

  onPullDownRefresh: function () {
    this.setAccountInfo();
    setTimeout(function(){
      wx.stopPullDownRefresh()
    }, 200);
    
  },

  setAccountInfo : function() {
    var self = this;
    request.httpPost({
      url: config.getAccountInfoUrl,
      success: function (data) {
        if (data.success) {
          var online = data.obj.shopDeliverApply.online;
          var frozen = data.obj.shopDeliverApply.frozen;
          self.setData({
            accountInfo: {
              userName: data.obj.account.userName,
              avatarUrl: data.obj.account.icon || '/image/default_icon.png',
              shopName: data.obj.mbShop.name,
              shopStatus: data.obj.shopDeliverApply.status,
              validOrders: data.obj.todayQuantity,
              turnover: Util.fenToYuan(data.obj.todayAmount).replace(/[,]/g, '')
            },
            online:{
              type: frozen == 1 ? 'default' : (online == 1 ? 'yellow' : 'default'),
              online: online,
              frozen: frozen,
              name: frozen == 1 ? '已冻结' : (online == 1 ? '营业中' : '停止营业')
            },
            pageLoad:true
          });
        }
      }
    })
  },
  
  toUser : function(){
    var url = '/page/component/user/user?userName=' + this.data.accountInfo.userName 
      + '&shopName=' + this.data.accountInfo.shopName
      + '&avatarUrl=' + this.data.accountInfo.avatarUrl;
    wx.navigateTo({
      url: url
    })
  },

  todayOrders: function(){
    wx.navigateTo({
      url: '/page/component/today-order-list/today-order-list'
    })
  }, 
  todayOrdersIncome: function() {
    wx.navigateTo({
      url: '/page/component/today-order-income/today-order-income'
    })
  },
  toRefuseOrder: function() {
    wx.navigateTo({
      url: '/page/component/reject-order-list/reject-order-list'
    })
  },
  toPurchase: function(){
    request.httpGet({
      url: config.getBaseDataByKeyUrl,
      data: { key: 'DSV400' },
      success: function (data) {
        if (data.success && data.obj) {
          wx.showModal({
            content: '请关注微信公众号【' + data.obj.name + '】进行采购！',
            showCancel: false
          });
        }
      }
    })
  },

  // 扫码签收
  scanSign: function() {
    var self = this;
    wx.scanCode({
      success: function(res) {
        if (res.errMsg == 'scanCode:ok' && res.scanType.toUpperCase() == 'CODABAR') {
          wx.navigateTo({
            url: '/page/component/order-detail/order-detail?orderId=' + res.result,
          })
        } else {
          self.scanFail(1);
        }
      },
      fail:function(res){
        if (res.errMsg != 'scanCode:fail cancel')
          self.scanFail(1);
      }
    })
  },

  scan: function() {
    var self = this;
    wx.scanCode({
      success: function(res) {
        if (res.errMsg == 'scanCode:ok' && res.scanType.toUpperCase() == 'QR_CODE') {
          request.httpGet({
            url: config.getOrderByCode,
            data:{code: res.result.substring(9)},
            success: function(data) {
              if(data.success && data.obj)
                wx.navigateTo({
                  url: '/page/component/order-detail/order-detail?orderId=' + data.obj,
                })
              else
                wx.showModal({
                  content: '自提码错误！',
                  showCancel: false
                });
            }
          })
        } else {
          self.scanFail(2);
        }
      },
      fail: function (res) {
        if (res.errMsg != 'scanCode:fail cancel')
          self.scanFail(2);
      }
    })
  },

  // 扫码打印
  scanPrint: function () {
    var self = this;
    wx.scanCode({
      success: function (res) {
        if (res.errMsg == 'scanCode:ok' && res.scanType.toUpperCase() == 'CODABAR') {
          self.print(res.result);
        } else {
          self.scanFail();
        }
      },
      fail: function (res) {
        if (res.errMsg != 'scanCode:fail cancel')
          self.scanFail();
      }
    })
  },

  scanFail:function(scanType){
    var self = this;
    wx.showModal({
      content: '扫码失败！',
      showCancel: false,
      success: function () {
        if (scanType) self.showModal(scanType);
      }
    });
  },

  setCode: function (e) {
    var code = e.detail.value;

    if (!Util.isEmpty(code)) {
      this.setData({
        'confirmBtn.disabled': false,
        code: code
      });
    } else {
      this.setData({
        'confirmBtn.disabled': true,
        code: code
      });
    }

  },

  fSearch:function() {
    this.showModal(1);
  },
  fTake:function(){
    this.showModal(2);
  },
  fPrint: function () {
    this.showModal(3);
  },

  search: function(){
    var self = this, code = this.data.code;
    if(this.data.scanType == 1) {
      self.cancel();
      wx.navigateTo({
        url: '/page/component/order-detail/order-detail?orderId=' + code,
      })
    } else if (this.data.scanType == 2){
      request.httpGet({
        url: config.getOrderByCode,
        data: { code: code },
        success: function (data) {
          if (data.success && data.obj) {
            self.cancel();
            wx.navigateTo({
              url: '/page/component/order-detail/order-detail?orderId=' + data.obj,
            })
          } else {
            wx.showModal({
              content: '自提码错误！',
              showCancel: false
            });
          }
        }
      })
    } else if (this.data.scanType == 3) {
      self.cancel();
      self.print(code);
    }
  },

  showModal: function (scanType) {
    // 显示遮罩层
    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true,
      'confirmBtn.disabled': true,
      code: '',
      scanType: scanType,
      codePlaceholder: (scanType == 1 || scanType == 3) ? '请输入订单号' : '请输入自提码'
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    if (!Util.isEmpty(this.data.code)) {
      return;
    }
    this.cancel();
  },
  cancel: function () {
    console.log(this.data.vcode);
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },

  print : function(orderId){
    request.httpPost({
      url: config.printUrl,
      data: { orderId: orderId },
      success: function (data) {
        if (data.success) {
          wx.showToast({
            title: "等待打印",
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
})