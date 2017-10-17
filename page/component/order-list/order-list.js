// page/component/order-list/order-list.js
var config = require('../../../config');
var request = require('../../common/request');
var Util = require('../../../util/util').Util;

var currPage = 1, rows = 10;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab : 0,
    orders: [],
    hasMore: false
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
        currentTab: e.target.dataset.current,
        orders: []
      })
      currPage = 1;
      self.getOrders(true);
    }
  },

  // 发货
  orderDeliver: function (e) {
    // 发送request处理订单
    var self = this;

    wx.showModal({
      title: '提示',
      content: '是否确定订单号【' + e.target.dataset.orderId + '】已发货？',
      success: function (res) {
        if (res.confirm) {
          request.httpPost({
            url: config.deliverOrderUrl,
            data: { id: e.target.dataset.orderId },
            success: function (data) {
              if (data.success) {
                var orders = self.data.orders;
                orders.splice(e.target.dataset.index, 1);
                self.setData({
                  orders: orders
                });
              }
            }
          })
        }
      }
    });

  },

  // 送达完成
  orderComplete: function (e) {
    // 发送request处理订单
    var self = this;

    wx.showModal({
      title: '提示',
      content: '是否确定订单号【' + e.target.dataset.orderId + '】已送达完成？',
      success: function (res) {
        if (res.confirm) {
          request.httpPost({
            url: config.completeOrderUrl,
            data: { id: e.target.dataset.orderId },
            success: function (data) {
              if (data.success) {
                var orders = self.data.orders;
                orders.splice(e.target.dataset.index, 1);
                self.setData({
                  orders: orders
                });
              }
            }
          })
        }
      }
    });

  },

  /**
   * TODO 暂时没做翻页
   * isRefresh:true=初始化或下拉刷新 false=上拉加载更多
   */
  getOrders: function (isRefresh) {
    var self = this, currentTab = this.data.currentTab, status;
    if (currentTab == 0) status = 'DOS20';
    else if (currentTab == 1) status = 'DOS25';
    else if (currentTab == 2) status = 'DOS30,DOS40';
    else status = 'DOS15';

    wx.showLoading({
      title: '努力加载中...',
      mask: true
    })

    request.httpGet({
      url: config.getOrdersUrl,
      data: { status: status, page: currPage, rows: rows },
      success: function (data) {
        if (data.success) {
          if (data.obj.rows.length >= rows) {
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
            data.obj.rows[i].amount = Util.fenToYuan(data.obj.rows[i].amount);
            data.obj.rows[i].addtime = Util.format(new Date(data.obj.rows[i].addtime.replace(/-/g, "/")), 'MM-dd HH:mm')
          }
          var orders = self.data.orders;
          if (isRefresh) orders = data.obj.rows;
          else orders = orders.concat(data.obj.rows);
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
    currPage = 1;
    this.getOrders(true);
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 200);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMore) {
      this.getOrders();
    } else {
      // wx.showToast({
      //   title: '无更多商品~',
      //   icon: 'loading',
      //   duration: 500
      // })
    }
  }
})