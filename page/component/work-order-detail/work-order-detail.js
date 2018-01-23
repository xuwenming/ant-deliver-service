// page/component/work-order-detail/work-order-detail.js
var config = require('../../../config');
var request = require('../../common/request');
var Util = require('../../../util/util').Util;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id : null,
    workOrder : null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self = this;
    wx.showNavigationBarLoading();
    request.httpGet({
      url: config.getWorkOrderDetailUrl,
      data: { id: self.data.id },
      success: function (data) {
        if (data.success) {
          data.obj.deliverOrderShop.amount = Util.fenToYuan(data.obj.deliverOrderShop.amount);
          data.obj.deliverOrderShop.addtime = Util.format(new Date(data.obj.deliverOrderShop.addtime.replace(/-/g, "/")), 'MM-dd HH:mm');
          data.obj.deliverOrderShop.distance = Util.distanceConvert(data.obj.deliverOrderShop.distance);
          var completeImages = data.obj.deliverOrderShop.completeImages;
          if (!Util.isEmpty(completeImages) && completeImages != 'null') {
            data.obj.deliverOrderShop.completeImages = completeImages.split(";");
          } else {
            data.obj.deliverOrderShop.completeImages = null;
          }

          data.obj.addtime = Util.format(new Date(data.obj.addtime.replace(/-/g, "/")), 'MM-dd HH:mm');

          self.setData({
            workOrder: data.obj
          });
        }
      }
    })
  },

  // 确认拒收
  orderConfirm: function (e) {
    var url = '/page/component/order-confirm/order-confirm?orderId=' + e.target.dataset.orderId;
    if (e.target.dataset.orderShopId) {
      url += '&orderShopId=' + e.target.dataset.orderShopId;
    }
    wx.navigateTo({
      url: url
    })
  },

  showImage: function (e) {
    var completeImages = this.data.workOrder.deliverOrderShop.completeImages;
    wx.previewImage({
      current: completeImages[e.target.dataset.index],
      urls: completeImages
    })
  },
})