// page/component/refuse-order/refuse-order.js
var config = require('../../../config');
var request = require('../../common/request');
var Util = require('../../../util/util').Util;

var orderId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    submit_disabled: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    orderId = options.orderId;
  },

  setContent: function(e){
    if (Util.isEmpty(e.detail.value)) {
      this.setData({ submit_disabled:true});
    } else {
      this.setData({ submit_disabled: false });
    }
  },

  refuseOrder: function(e){
    var self = this, params = e.detail.value;
    params.orderId = orderId;

    request.httpGet({
      url: config.refuseOrderUrl,
      data: params,
      success: function (data) {
        if (data.success) {
          self.cancel();
        }
      },
      error:function(){
        self.cancel();
      }
    })
  },

  cancel:function(){
    wx.navigateBack({
      delta: 1,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh() 
  }
})