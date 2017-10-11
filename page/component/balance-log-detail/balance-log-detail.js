// page/component/balance-log-detail/balance-log-detail.js
var config = require('../../../config');
var request = require('../../common/request');
var Util = require('../../../util/util').Util;

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request.httpGet({
      url: config.getBalanceLogDetailUrl,
      data: { refId: options.refId },
      success: function (data) {
        console.log(data)
        if (data.success) {
          
        }
      }
    })
  }
})