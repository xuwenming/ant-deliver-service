// page/component/balance-log-list/balance-log-list.js
var config = require('../../../config');
var request = require('../../common/request');
var Util = require('../../../util/util').Util;

var currPage = 1, rows = 10;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    balanceLogs:null,
    income:null,  // 收入
    expenditure:null, // 支出
    cond:{
      showDate : '本月',
      date: Util.format(new Date(), 'yyyy-MM'),
      start : '2017-01',
      end : Util.format(new Date(), 'yyyy-MM')
    },
    hasMore: false,

    noDataMsg:'您这个月没有相关的账单哦~'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    currPage = 1;
    this.totalBalanceByMonth();
  },

  totalBalanceByMonth: function(){
    var self = this;
    wx.showNavigationBarLoading();
    request.httpGet({
      url: config.totalBalanceByMonth,
      data: { date: self.data.cond.date},
      showLoading: true,
      success: function (data) {
        if (data.success) {
          self.setData({
            income: Util.fenToYuan(data.obj.income),
            expenditure: Util.fenToYuan(-data.obj.expenditure)
          });
          self.getBalanceLogs(true);
        }
      }
    })
  },

  getBalanceLogs: function (isRefresh) {
    var self = this;
    // wx.showLoading({
    //   title: '努力加载中...',
    //   mask: true
    // })

    request.httpGet({
      url: config.getBalanceLogsUrl,
      data: { date: self.data.cond.date, page: currPage, rows: rows},
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
            var pre, balanceLog = data.obj.rows[i];
            var amount = balanceLog.amount;
            if (balanceLog.amount < 0) {
              pre = "-";
              amount = -amount;
            } else {
              pre = "+";
            }
            data.obj.rows[i].amount = pre + Util.fenToYuan(amount);
            data.obj.rows[i].balanceAmount = Util.fenToYuan(self.getBalanceAmount(balanceLog.remark));
          }
          var balanceLogs = self.data.balanceLogs;
          if (isRefresh) balanceLogs = data.obj.rows;
          else balanceLogs = balanceLogs.concat(data.obj.rows);
          self.setData({
            balanceLogs: balanceLogs
          });
        }
      }
    })
  },

  bindDateChange : function(e){
    var showDate;
    if (e.detail.value == Util.format(new Date(), 'yyyy-MM')) {
      showDate = '本月'
    } else {
      showDate = Util.format(new Date(e.detail.value), 'yyyy年M月')
    }
     
    this.setData({
      'cond.showDate': showDate,
      'cond.date': e.detail.value,
      balanceLogs: null
    });

    currPage = 1;
    this.totalBalanceByMonth();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    currPage = 1;
    this.getBalanceLogs(true);
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 200);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMore) {
      this.getBalanceLogs();
    } else {
      // wx.showToast({
      //   title: '无更多商品~',
      //   icon: 'loading',
      //   duration: 500
      // })
    }
  },

  getBalanceAmount:function(remark){
    //用来判断是否把连续的0去掉
    if (typeof remark === "string") {
      // var arr = Str.match(/(0\d{2,})|([1-9]\d+)/g);
      //"/[1-9]\d{1,}/g",表示匹配1到9,一位数以上的数字(不包括一位数).
      //"/\d{2,}/g",  表示匹配至少二个数字至多无穷位数字
      var arr = remark.match(/期末余额:[0-9\-]{1,}分/);
      if (arr && arr.length > 0) {
        var num = arr[arr.length - 1];
        num = num.replace("期末余额:", "").replace("分", "");
        return num;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

})