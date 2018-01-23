// page/component/order-confirm/order-confirm.js
var config = require('../../../config');
var request = require('../../common/request');
var Util = require('../../../util/util').Util;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: null,
    orderShopId: null,
    completeRemark:'',
    driverCompleteImagesStr: '',
    driverCompleteImages:null,
    driverCompleteRemark: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    self.setData({
      orderId: options.orderId,
      orderShopId: options.orderShopId || null
    });

    if (self.data.orderShopId != null) {
      wx.setNavigationBarTitle({
        title: '拒收确认',
      })
    }

    request.httpPost({
      url: config.getDriverOrderUrl,
      data: { id: options.orderId },
      success: function (data) {
        if (data.success && data.obj) {
          var completeImages = data.obj.completeImages, driverCompleteImages = null;
          if (!Util.isEmpty(completeImages) && completeImages != 'null') {
            driverCompleteImages = completeImages.split(";");
          }
          self.setData({
            driverCompleteImagesStr: completeImages,
            driverCompleteImages: driverCompleteImages,
            driverCompleteRemark: data.obj.completeRemark
          });
        }
      }
    })
  },

  setCompleteRemark: function (e) {
    this.setData({ completeRemark: e.detail.value });
  },

  showImage: function (e) {
    var completeImages = this.data.driverCompleteImages;
    wx.previewImage({
      current: completeImages[e.target.dataset.index],
      urls: completeImages
    })
  },

  cancel: function () {
    wx.navigateBack({
      delta: 1,
    })
  },

  orderComplete: function () {
    var self = this;
    var msg = '是否确定订单号【' + self.data.orderId + '】已送达完成？', url = config.completeOrderUrl, title = '送达完成';
    var data = { id: self.data.orderId, completeImages: self.data.driverCompleteImagesStr || '', completeRemark: self.data.completeRemark || '' };
    if(self.data.orderShopId != null) {
      msg = '是否确认拒收订单【' + self.data.orderId + '】已入库完成？';
      url = config.editOrderAndStockInMarketServiceUrl;
      title = '拒收完成';
      data.orderShopId = self.data.orderShopId;
    }

    wx.showModal({
      title: '提示',
      content: msg,
      success: function (res) {
        if (res.confirm) {
          request.httpPost({
            url: url,
            data: data,
            showLoading: true,
            success: function (data) {
              if (data.success) {
                wx.showToast({
                  title: title,
                  icon: 'success',
                  mask: true,
                  complete: function () {
                    setTimeout(function () {
                      self.cancel();
                    }, 1000);
                  }
                })
              }
            },
            fail: function () {
              wx.hideLoading();
            }
          })
        }
      }
    });
  }
})