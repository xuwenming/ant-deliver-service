// page/component/order-complete/order-complete.js
var app = getApp();
var config = require('../../../config');
var request = require('../../common/request');
var Util = require('../../../util/util').Util;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:null,
    orderShopId:null,
    tempFilePaths:[],
    completeImages:'',
    completeRemark:'',
    uploadRequired:true
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
      url: config.getShopApplyUrl,
      success: function (data) {
        if (data.success && data.obj) {
          self.setData({
            uploadRequired: data.obj.uploadRequired
          });
        }
      }
    })
  },

  setCompleteRemark: function (e) {
    this.setData({ completeRemark: e.detail.value });
  },

  chooseImage: function(){
    var self = this, tempFilePaths = this.data.tempFilePaths;
    wx.chooseImage({
      count:3,
      sizeType: ['compressed'],
      success: function (res) {
        tempFilePaths = tempFilePaths.concat(res.tempFilePaths);
        self.setData({
          tempFilePaths: tempFilePaths
        })
      }
    })
  },

  delImage : function(e){
    var tempFilePaths = this.data.tempFilePaths;
    tempFilePaths.splice(e.target.dataset.index, 1);
    this.setData({
      tempFilePaths: tempFilePaths
    })
  },

  showImage:function(e){
    var tempFilePaths = this.data.tempFilePaths;
    wx.previewImage({
      current: tempFilePaths[e.target.dataset.index], 
      urls: tempFilePaths 
    })
  },

  orderComplete:function(){
    var self = this, uploadRequired = self.data.uploadRequired;
    if (uploadRequired && self.data.tempFilePaths.length == 0) {
        wx.showModal({
          content: '请至少上传一张图片！',
          showCancel: false
        });
        return;
    }

    if (self.data.tempFilePaths.length == 0) {
      self.complete();
    } else {
      wx.showLoading({
        title: '上传中...',
        mask: true
      });

      app.uploadImage({
        url: config.uploadImageUrl,
        filePaths: this.data.tempFilePaths,
        name: 'imageFile',
        success: function (completeImages) {
          // console.log(completeImages);
          self.setData({
            completeImages: completeImages
          });
          self.complete();
        }
      });
    }
  },

  complete: function (){
    var self = this;
    var msg = '是否确定订单号【' + self.data.orderId + '】已送达完成？', url = config.completeOrderUrl, title = '送达完成';
    var data = { id: self.data.orderId, completeImages: self.data.completeImages || '', completeRemark: self.data.completeRemark || '' };
    if (self.data.orderShopId != null) {
      msg = '是否确定订单号【' + self.data.orderId + '】客户退货拒收？';
      url = config.editRejectFromCustomerUrl;
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
                    setTimeout(function(){
                      self.cancel();
                    }, 1000);
                  }
                })
              }
            },
            fail:function(){
              wx.hideLoading();
            }
          })
        }
      }
    });
  },

  cancel: function () {
    wx.navigateBack({
      delta: 1,
    })
  }
 
})