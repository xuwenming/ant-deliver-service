// page/component/shop-auth/shop-auth.js
var config = require('../../../config');
var request = require('../../common/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shops : []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;

    request.httpGet({
      url: config.getShopsUrl,
      success: function (data) {
        if (data.success) {
          self.setData({
            shops: data.obj
          });
        } 
      }
    })
  },

  chooseShop : function(e){
    console.log(e);
    wx.showModal({
      title:'提示',
      content: '是否绑定该门店账号，绑定之后不可更改！',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定', e.target.dataset.shopId);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  }
})