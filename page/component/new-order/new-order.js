// page/component/new-order/new-order.js
var config = require('../../../config');
var request = require('../../common/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[]
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
    console.log("getNewOrders");
    this.getNewOrders(true);
  },

  /**
   * TODO 暂时没做翻页
   * isRefresh:true=初始化或下拉刷新 false=上拉加载更多
   */
  getNewOrders: function (isRefresh){
    var self = this;
    request.httpGet({
      url: config.newOrdersUrl,
      success: function (data) {
        if (data.success) {
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

  processOrder:function(e){
    // TODO 发送request处理订单
    var self = this;

    wx.showModal({
      content: '处理成功，可前往已处理订单查看！',
      showCancel: false,
      success:function(res){
        if (res.confirm) {
          var orders = self.data.orders;
          orders.splice(e.target.dataset.index, 1);
          self.setData({
            orders: orders
          });
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
    this.getNewOrders(true);
    setTimeout(function(){
      wx.stopPullDownRefresh()  
    },1000);
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getNewOrders();
  }
})