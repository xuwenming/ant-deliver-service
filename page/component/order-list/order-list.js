// page/component/order-list/order-list.js
var config = require('../../../config');
var request = require('../../common/request');
var Util = require('../../../util/util').Util;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab : 0,
    orders: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getOrders(true);
  },

  switchTab:function(e){
    var self = this;

    if (self.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      self.setData({
        currentTab: e.target.dataset.current
      })
      self.getOrders(true);
    }
  },

  /**
   * TODO 暂时没做翻页
   * isRefresh:true=初始化或下拉刷新 false=上拉加载更多
   */
  getOrders: function (isRefresh) {
    var self = this;
    request.httpGet({
      url: config.newOrdersUrl,
      success: function (data) {
        if (data.success) {
          for (var i in data.obj) {
            data.obj[i].freight = Util.fenToYuan(data.obj[i].freight);
          }
          var orders = self.data.orders;
          if (isRefresh) orders = data.obj;
          else orders = orders.concat(data.obj);
          self.setData({
            orders: orders
          });
        }
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  }
})