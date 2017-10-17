// page/component/new-order/new-order.js
var config = require('../../../config');
var request = require('../../common/request');
var Util = require('../../../util/util').Util;
var timer = require('../../../util/wxTimer');


var currPage = 1, rows = 10;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    hasMore: false,
    wxTimerList: {}
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
    this.getNewOrders(true);
  },

  /**
   * TODO 暂时没做翻页
   * isRefresh:true=初始化或下拉刷新 false=上拉加载更多
   */
  getNewOrders: function (isRefresh){
    var self = this;
    wx.showLoading({
      title: '努力加载中...',
      mask: true
    })
    request.httpGet({
      url: config.getOrdersUrl,
      data: { status: 'DOS10', page: currPage, rows: rows},
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

          for (var i=0; i<data.obj.rows.length; i++) {
            data.obj.rows[i].amount = Util.fenToYuan(data.obj.rows[i].amount);
            data.obj.rows[i].addtime = Util.format(new Date(data.obj.rows[i].addtime.replace(/-/g, "/")), 'MM-dd HH:mm');

            if(!self.data.wxTimerList["wxTimer" + data.obj.rows[i].id]) {
              var time = data.obj.rows[i].millisecond;
              // if (time > 0) {
              if (time) {
                time = time/1000;
                var m = Math.floor(((time % 86400) % 3600) / 60),
                    s = Math.floor(((time % 86400) % 3600) % 60);
                var wxTimer = new timer({
                  //beginTime: "00:" + m + ":" + s,
                  beginTime: "00:10:00",
                  name: "wxTimer" + data.obj.rows[i].id,
                  complete: function () {
                    var orders = self.data.orders;
                    for (var j in orders) {
                      if (orders[j].id == this.name.substr(7)) {
                        orders.splice(j, 1);
                        break;
                      }
                    }

                    self.setData({
                      orders: orders
                    });
                  }
                })
                wxTimer.start(self);
              } else {
                data.obj.rows.splice(i--, 1);
              }
            }
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

  processOrder:function(e){
    // 发送request处理订单
    var self = this;

    wx.showModal({
      title:'提示',
      content: '接单之后不可取消，是否继续？',
      success: function (res) {
        if (res.confirm) {
          request.httpPost({
            url: config.acceptOrderUrl,
            data: { id: e.target.dataset.orderId },
            success: function (data) {
              if (data.success) {
                wx.showModal({
                  content: '成功接单，可前往已处理订单查看！',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      var orders = self.data.orders;
                      orders.splice(e.target.dataset.index, 1);
                      self.setData({
                        orders: orders
                      });
                    }
                  }
                });
              }
            }
          })
        }
      }
    });
    
  },

  refuseOrder : function(e){
    wx.navigateTo({
      url: '/page/component/refuse-order/refuse-order?orderId=' + e.target.dataset.orderId
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    currPage = 1;
    this.getNewOrders(true);
    setTimeout(function(){
      wx.stopPullDownRefresh()  
    }, 200);
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMore) {
      this.getNewOrders();
    } else {
      // wx.showToast({
      //   title: '无更多商品~',
      //   icon: 'loading',
      //   duration: 500
      // })
    }
  }
})