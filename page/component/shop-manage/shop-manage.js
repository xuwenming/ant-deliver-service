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
    pageLoad:false
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
      url: '/page/component//'
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
    wx.scanCode({
      success: function(res) {
        if (res.errMsg == 'scanCode:ok' && res.scanType.toUpperCase() == 'CODABAR') {
          wx.navigateTo({
            url: '/page/component/order-detail/order-detail?orderId=' + res.result,
          })
        } else {
          wx.showModal({
            content: '扫码失败！',
            showCancel: false
          });
        }
      },
      fail:function(res){
        if (res.errMsg != 'scanCode:fail cancel')
          wx.showModal({
            content: '扫码失败！',
            showCancel: false
          });
      }
    })
  },

  scan: function() {
    var orderId = null;
    wx.scanCode({
      success: function(res) {
        console.log(res)
        request.httpGet({
          url: config.getOrderByCode,
          data:{code: res.result.substring(9)},
          success: function(data) {
            if (res.errMsg == 'scanCode:ok' && res.scanType.toUpperCase() == 'QR_CODE') {
            wx.navigateTo({
              url: '/page/component/order-detail/order-detail?orderId=' + data.obj,
            })
            }else {
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
    })
  }
})