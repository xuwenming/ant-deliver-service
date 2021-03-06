// page/component/order-list/order-list.js
var app = getApp();
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
    orders: null,
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
   var self = this;
  self.getOrders(true);  
  wx.showNavigationBarLoading();
  },

  onHide: function () {
    
  },
  onUnload: function () {
    
  },
  switchTab: function (e) {
    var self = this;

    if (self.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      self.setData({
        currentTab: e.target.dataset.current,
        orders: null
      })
      currPage = 1;
      wx.showNavigationBarLoading();
      self.getOrders(true);
    }
  }, 

  viewDetail: function (e) {
    wx.navigateTo({
      url: '/page/component/order-detail/order-detail?orderId=' + e.currentTarget.dataset.orderId
    })
  },


  
  
            

 


  /**
   * TODO 暂时没做翻页
   * isRefresh:true=初始化或下拉刷新 false=上拉加载更多
   */
  getOrders: function (isRefresh) {
    var self = this, status = 'DOS20,DOS21,DOS22';
    var url = config.getOrdersUrl;
    // wx.showLoading({
    //   title: '努力加载中...',
    //   mask: true
    // })

    request.httpGet({
      url: url,
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
            data.obj.rows[i].addtime = Util.format(new Date(data.obj.rows[i].addtime.replace(/-/g, "/")), 'MM-dd HH:mm');
            data.obj.rows[i].distance = Util.distanceConvert(data.obj.rows[i].distance);
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
    wx.showNavigationBarLoading();
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
      wx.showNavigationBarLoading();
      this.getOrders();
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
  },
  confirmStockIn: function (e) {
    var self = this;
    wx.showModal({
      title: '提示',
      content: '是否确定订单号【' + e.target.dataset.orderId + '】已入库？',
      success: function (res) {
        if (res.confirm) {
          request.httpPost({
            url: config.editItemStock,
            data: { id: e.target.dataset.orderId},
            showLoading: true,
            success: function (data) {
              if (data.success) {
                wx.showToast({
                  title: "入库成功",
                  icon: 'success',
                  mask: true,
                  duration: 500,
                  complete: function () {
                    var orders = self.data.orders;
                    orders.splice(e.target.dataset.index, 1);
                    self.setData({
                      orders: orders
                    });
                  }
                })
              }
            }
          })
        }
      }
    });
  }
})