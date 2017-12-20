// page/component/order-detail/order-detail.js
var config = require('../../../config');
var request = require('../../common/request');
var Util = require('../../../util/util').Util;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:null,
    order:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId
    });
  },

  onShow:function(){
    var self = this;
    wx.showNavigationBarLoading();
    request.httpGet({
      url: config.getOrderDetailUrl,
      data: { id: self.data.orderId },
      success: function (data) {
        if (data.success) {
          if (!data.obj) {
            wx.showModal({
              content: '未匹配到对应订单！',
              showCancel: false,
              success: function () {
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
  },

  editFetchOrder: function () {
    var self = this;
    wx.showModal({
      title: '提示',
      content: '是否确定订单号【' + self.data.order.id + '】已提货？',
      success: function (res) {
        if (res.confirm) {
          request.httpPost({
            url: config.editFetchOrder,
            data: { id: self.data.order.id },
            showLoading: true,
            success: function (data) {
              wx.showToast({
                title: "自提完成",
                icon: 'success',
                mask: true,
                duration: 1000,
                complete: function () {
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 1,
                    })
                  }, 1000)
                }
              })
            }
          })
        }
      }
    })
  },

  // 发货
  orderDeliver: function () {
    // 发送request处理订单
    var self = this;

    wx.showModal({
      title: '提示',
      content: '是否确定订单号【' + self.data.order.id + '】已发货？',
      success: function (res) {
        if (res.confirm) {
          request.httpPost({
            url: config.deliverOrderUrl,
            data: { id: self.data.order.id },
            showLoading: true,
            success: function (data) {
              if (data.success) {
                wx.showToast({
                  title: "发货成功",
                  icon: 'success',
                  mask: true,
                  duration: 500,
                  complete: function () {
                    setTimeout(function () {
                      wx.navigateBack({
                        delta: 1,
                      })
                    }, 1000)
                  }
                })
              }
            }
          })
        }
      }
    });

  },

  // 确认取货
  pickupConfirm: function (e) {
    // 发送request处理订单
    var self = this;

    wx.showModal({
      title: '提示',
      content: '是否确定订单号【' + self.data.order.id + '】已派货？',
      success: function (res) {
        if (res.confirm) {
          request.httpPost({
            url: config.editConfirmItemTokenByDriverUrl,
            data: { id: self.data.order.id },
            showLoading: true,
            success: function (data) {
              if (data.success) {
                wx.showToast({
                  title: "派货成功",
                  icon: 'success',
                  mask: true,
                  duration: 500,
                  complete: function () {
                    setTimeout(function () {
                      wx.navigateBack({
                        delta: 1,
                      })
                    }, 1000)
                  }
                })
              }
            }
          })
        }
      }
    });

  },

  // 送达完成
  orderComplete: function (e) {
    wx.navigateTo({
      url: '/page/component/order-complete/order-complete?orderId=' + this.data.order.id
    })

  },

  // 送达确认
  orderConfirm: function (e) {
    wx.navigateTo({
      url: '/page/component/order-confirm/order-confirm?orderId=' + this.data.order.id
    })
  }
  
})