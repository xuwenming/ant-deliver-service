// page/component/item-manage/item-manage.js
var config = require('../../../config');
var request = require('../../common/request');

var currPage = 1, rows = 10;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    items:[],
    hasMore:false
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
        currentTab: e.target.dataset.current,
        items:[]
      });
      currPage = 1;
      self.getItems(true);
    }
  },

  /**
   * TODO 暂时没做翻页
   * isRefresh:true=初始化或下拉刷新 false=上拉加载更多
   */
  getItems: function (isRefresh) {
    var self = this;
    var url;
    if (self.data.currentTab == 0) 
      url = config.getAllItemsUrl;
    else if (self.data.currentTab == 1)
      url = config.getOnlineItemsUrl;
    else if (self.data.currentTab == 2)
      url = config.getOfflineItemsUrl;

    request.httpGet({
      url: url,
      data: {page: currPage, rows: rows },
      success: function (data) {
        console.log(data);
        if (data.success) {
          if (data.obj.rows.length >= 10) {
            currPage ++;
            self.setData({
              hasMore: true
            });
          } else {
            self.setData({
              hasMore: false
            });
          }

          var items = self.data.items;
          if (isRefresh) items = data.obj.rows;
          else items = items.concat(data.obj.rows);
          self.setData({
            items: items
          });
        }
      }
    })
  },
  
  batchUp:function(){
    wx.navigateTo({
      url: '/page/component/item-batch/item-batch?type=up',
    })
  },
  batchDown: function () {
    wx.navigateTo({
      url: '/page/component/item-batch/item-batch?type=down',
    })
  },
  batchDel: function () {
    wx.navigateTo({
      url: '/page/component/item-batch/item-batch?type=del',
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    currPage = 1;
    this.getItems(true);
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 200);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.hasMore) {
      wx.showLoading({
        title:'努力加载中...'
      })
      this.getItems();
    } else {
      wx.showToast({
        title: '无更多商品~',
        icon:'loading',
        duration:500
      })
    }
  }
})