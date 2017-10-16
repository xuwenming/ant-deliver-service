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
      avatarUrl: '/image/test/avatr.jpg',
      shopName:'Ryan的门店',
      shopStatus:'',
      validOrders:6,
      turnover:20
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setAccountInfo();
  },

  onPullDownRefresh: function () {
    this.setAccountInfo();
    setTimeout(function(){
      wx.stopPullDownRefresh()
    }, 500);
    
  },

  setAccountInfo : function() {
    var self = this;
    request.httpPost({
      url: config.getAccountInfoUrl,
      success: function (data) {
        if (data.success) {
          console.log(data);
          self.setData({
            accountInfo: {
              userName: data.obj.account.userName,
              avatarUrl: data.obj.account.icon,
              shopName: data.obj.mbShop.name,
              shopStatus: data.obj.shopDeliverApply.status,
              validOrders: data.obj.todayQuantity,
              turnover: Util.fenToYuan(data.obj.todayAmount)
            }
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
  }
})