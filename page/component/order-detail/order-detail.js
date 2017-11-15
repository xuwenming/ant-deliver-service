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
          data.obj.amount = Util.fenToYuan(data.obj.amount);
          data.obj.addtime = Util.format(new Date(data.obj.addtime.replace(/-/g, "/")), 'MM-dd HH:mm');
          data.obj.distance = Util.distanceConvert(data.obj.distance);
          var completeImages = data.obj.completeImages;
          console.log(completeImages != '\"null\"')
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
  
})