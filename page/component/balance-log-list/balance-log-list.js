// page/component/balance-log-list/balance-log-list.js
var config = require('../../../config');
var request = require('../../common/request');
var Util = require('../../../util/util').Util;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    balanceLogs:[],
    cond:{
      showDate : '本月',
      date: Util.format(new Date(), 'yyyy-MM'),
      start : '2017-01',
      end : Util.format(new Date(), 'yyyy-MM')
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBalanceLogs(true);
  },

  getBalanceLogs: function (isRefresh) {
    var self = this;
    request.httpGet({
      url: config.getBalanceLogsUrl,
      data: { date: self.data.cond.date},
      success: function (data) {
        if (data.success) {
          for (var i in data.obj.rows) {
            var pre, balanceLog = data.obj.rows[i];
            var amount = balanceLog.amount;
            if (balanceLog.amount < 0) {
              pre = "-";
              amount = -amount;
            } else {
              pre = "+";
            }
            data.obj.rows[i].amount = pre + Util.fenToYuan(amount);
          }
          var balanceLogs = self.data.balanceLogs;
          if (isRefresh) balanceLogs = data.obj.rows;
          else balanceLogs = balanceLogs.concat(data.obj.rows);
          self.setData({
            balanceLogs: balanceLogs
          });
        }
      }
    })
  },

  bindDateChange : function(e){
    var showDate;
    if (e.detail.value == Util.format(new Date(), 'yyyy-MM')) {
      showDate = '本月'
    } else {
      showDate = Util.format(new Date(e.detail.value.replace(/-/g, "/")), 'yyyy年M月')
    }
     
    this.setData({
      'cond.showDate': showDate,
      'cond.date': e.detail.value
    });

    this.getBalanceLogs(true);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})