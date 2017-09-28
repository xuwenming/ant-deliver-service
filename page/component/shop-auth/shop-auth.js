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

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  chooseShop : function(e){
    wx.showModal({
      title:'提示',
      content: '是否绑定门店【' + e.target.dataset.shopName+'】，绑定之后不可更改！',
      success: function (res) {
        if (res.confirm) {
          request.httpPost({
            url: config.addShopApplyUrl,
            data: { shopId: e.target.dataset.shopId},
            success: function (data) {
              if (data.success) {
                wx.showModal({
                  title: '提示',
                  content: '门店申请已提交，请耐心等待或致电客服！',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      wx.switchTab({
                        url: '../new-order/new-order'
                      });
                    }
                  }
                });
              }
            }
          })
        }
      }
    });
  }
})