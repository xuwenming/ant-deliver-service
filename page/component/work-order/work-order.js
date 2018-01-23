// page/component/work-order/work-order.js
var config = require('../../../config');
var request = require('../../common/request');
var Util = require('../../../util/util').Util;

var currPage = 1, rows = 10;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    workOrders: null,
    hasMore: false,

    noDataMsg: '没有相关工单哦~'
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
    currPage = 1;
    this.getWorkOrders(true);
  },

  switchTab: function (e) {
    var self = this;

    if (self.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      self.setData({
        currentTab: e.target.dataset.current,
        workOrders: null
      })
      currPage = 1;
      self.getWorkOrders(true);
    }
  },

  getWorkOrders: function (isRefresh) {
    var self = this, currentTab = this.data.currentTab, data = { page: currPage, rows: rows, sort: 'addtime', order: 'desc' };
    if (currentTab == 0) {
      data.type = 'SMST04';
      data.status = 'SMSS10';
    } else if (currentTab == 1) {
      data.status = 'SMSS40,SMSS50,SMSS60,SMSS70';
    }

    wx.showNavigationBarLoading();

    request.httpGet({
      url: config.getWorkOrdersUrl,
      data: data,
      success: function (data) {
        if (data.success) {
          if (data.obj.rows.length >= 10) {
            currPage++;
            self.setData({
              hasMore: true
            });
          } else {
            self.setData({
              hasMore: false
            });
          }

          for (var i in data.obj.rows) {
            var workOrder = data.obj.rows[i];
          }
          var workOrders = self.data.workOrders;
          if (isRefresh) workOrders = data.obj.rows;
          else workOrders = workOrders.concat(data.obj.rows);
          self.setData({
            workOrders: workOrders
          });
        }
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    currPage = 1;
    this.getWorkOrders(true);
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 200);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMore) {
      this.getWorkOrders();
    }
  }
})