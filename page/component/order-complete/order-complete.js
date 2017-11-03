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
    tempFilePaths:[],
    completeImages:null,
    completeRemark:null,
    complete_disabled:true,
    uploadRequired:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    self.setData({
      orderId: options.orderId
    });

    request.httpPost({
      url: config.getShopApplyUrl,
      success: function (data) {
        if (data.success && data.obj) {
          self.setData({
            complete_disabled: false,
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
      success: function (res) {
        tempFilePaths = tempFilePaths.concat(res.tempFilePaths);
        self.setData({
          tempFilePaths: tempFilePaths
        })
      }
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
      app.uploadImage({
        url: config.uploadImageUrl,
        filePaths: this.data.tempFilePaths,
        name: 'imageFile',
        success: function (completeImages) {
          console.log(completeImages);
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
    wx.showModal({
      title: '提示',
      content: '是否确定订单号【' + self.data.orderId + '】已送达完成？',
      success: function (res) {
        if (res.confirm) {
          request.httpPost({
            url: config.completeOrderUrl,
            data: { id: self.data.orderId, completeImages: self.data.completeImages, completeRemark: self.data.completeRemark },
            showLoading: true,
            success: function (data) {
              if (data.success) {
                wx.showToast({
                  title: "送达完成",
                  icon: 'success',
                  mask: true,
                  complete: function () {
                    setTimeout(function(){
                      self.cancel();
                    }, 1000);
                  }
                })
              }
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