// page/component/shop-auth/shop-auth.js
var config = require('../../../config');
var request = require('../../common/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shops : [],
    status : null,
    mbShop:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    var status = options.status;
    self.setData({status:status});

    if (!status) {
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
    } else {
      request.httpPost({
        url: config.getShopApplyUrl,
        success: function (data) {
          if (data.success && data.obj) {
            self.setData({
              status: status,
              mbShop: {
                name: data.obj.mbShop.name,
                address: data.obj.mbShop.address,
                contactPeople: data.obj.mbShop.contactPeople + '（缺少认证中图标）',
                statusIcon: status == 'DAS01' ? '/image/auth_failed.png' : (status == 'DAS01' ? '/image/auth_success.png' : '/image/auth_failed.png')
              }
            });
          }
        }
      })
    } 

  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  chooseShop : function(e){
    var self = this;
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
                      self.setData({
                        status:'DAS01',
                        mbShop:{
                          name: e.target.dataset.shopName,
                          address: e.target.dataset.address,
                          contactPeople: e.target.dataset.contactPeople + '（缺少认证中图标）',
                          statusIcon: '/image/auth_failed.png'
                        }
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