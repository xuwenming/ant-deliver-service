// page/component/order-list/order-list.js
var app = getApp();
var config = require('../../../config');
var request = require('../../common/request');
var Util = require('../../../util/util').Util;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: null,
    noDataMsg: '没有相关订单哦~'
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

  /**
   * TODO 暂时没做翻页
   * isRefresh:true=初始化或下拉刷新 false=上拉加载更多
   */
  getOrders: function (isRefresh) {
    var self = this;

    wx.showNavigationBarLoading();

    request.httpGet({
      url: config.getTodayOrdersIncome,
      success: function (data) {
        if (data.success) {

          for (var i in data.obj) {
            data.obj[i].amount = Util.fenToYuan(data.obj[i].amount);
            data.obj[i].addtime = Util.format(new Date(data.obj[i].addtime.replace(/-/g, "/")), 'MM-dd HH:mm');
            data.obj[i].distance = Util.distanceConvert(data.obj[i].distance);
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
    // currPage = 1;
    // this.getOrders(true);
    // setTimeout(function () {
    //   wx.stopPullDownRefresh()
    // }, 200);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMore) {
      //this.getOrders();
    } else {
      // wx.showToast({
      //   title: '无更多商品~',
      //   icon: 'loading',
      //   duration: 500
      // })
    }
  },

  openMap: function (e) {
    var self = this,
      latitude = e.currentTarget.dataset.latitude,
      longitude = e.currentTarget.dataset.longitude;
    if (!latitude || !longitude) {
      wx.showModal({
        content: '未知位置，无法规划路线！',
        showCancel: false
      });
      return;
    }
    var mars_point = Util.baiduTomars(longitude, latitude);
    wx.getLocation({
      success: function (res) {
        wx.openLocation({
          latitude: Number(mars_point.lat),
          longitude: Number(mars_point.lng),
          address: e.currentTarget.dataset.address
        })
      },
      fail: function () {
        app.getAuthorize({
          scope: 'scope.userLocation',
          content: '检测到您没打开定位权限，是否去设置打开？',
          required: true // 必须授权
        })
      }
    })
  },
  callPhone: function (e) {
    var phone = e.currentTarget.dataset.phone;
    if (phone)
      wx.makePhoneCall({
        phoneNumber: phone
      })
  }
})