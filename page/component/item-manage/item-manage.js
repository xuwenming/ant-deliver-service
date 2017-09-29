// page/component/item-manage/item-manage.js
var config = require('../../../config');
var request = require('../../common/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    items:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getItems(true);
  },

  switchTab: function (e) {
    var self = this;

    if (self.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      self.setData({
        currentTab: e.target.dataset.current
      })
      self.getItems(true);
    }
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