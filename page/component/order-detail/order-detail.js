// page/component/order-detail/order-detail.js
var config = require('../../../config');
var request = require('../../common/request');
var Util = require('../../../util/util').Util;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    wx.showNavigationBarLoading();
    request.httpGet({
      url: config.getOrderDetailUrl,
      data: { id: options.orderId },
      success: function (data) {
        if (data.success) {
          if (!data.obj) {
            wx.showModal({
              content: '该条形码无对应订单！',
              showCancel: false,
              success:function(){
                wx.navigateBack({
                  delta: 1,
                })
              }
            });
            return;
          }
          data.obj.amount = Util.fenToYuan(data.obj.amount);
          data.obj.addtime = Util.format(new Date(data.obj.addtime.replace(/-/g, "/")), 'MM-dd HH:mm');
          data.obj.distance = Util.distanceConvert(data.obj.distance);
          var completeImages = data.obj.completeImages;
          if (!Util.isEmpty(completeImages) && completeImages != 'null') {
            data.obj.completeImages = completeImages.split(";");
          } else {
            data.obj.completeImages = null;
          }
          self.setData({
            order: data.obj
          });
        }
      }
    })
  },

  showImage: function (e) {
    var completeImages = this.data.order.completeImages;
    wx.previewImage({
      current: completeImages[e.target.dataset.index],
      urls: completeImages
    })
  },

  // 确认签收
  sign: function(){
    // 发送request处理订单
    var self = this;

    request.httpPost({
      url: config.editOrderSignUrl,
      data: { id: self.data.order.id },
      showLoading: true,
      success: function (data) {
        if (data.success) {
          wx.showToast({
            title: "签收成功",
            icon: 'success',
            mask: true,
            duration: 1000,
            complete: function () {
              setTimeout(function(){
                wx.navigateBack({
                  delta: 1,
                })
              }, 1000)
            }
          })
        } else {
          wx.showModal({
            content: data.msg,
            showCancel: false,
            success: function () {
              wx.navigateBack({
                delta: 1,
              })
            }
          });
        }
      }
    })
  }
  
})