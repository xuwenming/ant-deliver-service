// page/component/item-batch/item-batch.js
var config = require('../../../config');
var request = require('../../common/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    optType:'',
    items:[],
    itemIds:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      optType: options.type
    });
    wx.setNavigationBarTitle({
      title: options.type == 'up' ? '批量上架' : (options.type == 'down' ? '批量下架' : '批量删除')
    });

    this.getItems(true);
  },

  /**
   * TODO 暂时没做翻页
   * isRefresh:true=初始化或下拉刷新 false=上拉加载更多
   */
  getItems: function (isRefresh) {
    var self = this;
    request.httpGet({
      url: config.getItemsUrl,
      success: function (data) {
        if (data.success) {
          var items = self.data.items;
          if (isRefresh) items = data.obj;
          else items = items.concat(data.obj);
          self.setData({
            items: items
          });
        }
      }
    })
  },

  checkboxChange: function (e) {
    this.setData({
      itemIds: e.detail.value.join(',')
    });
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