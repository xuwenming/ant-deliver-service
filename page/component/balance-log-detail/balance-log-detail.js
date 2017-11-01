// page/component/balance-log-detail/balance-log-detail.js
var config = require('../../../config');
var request = require('../../common/request');
var Util = require('../../../util/util').Util;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    refType:null,
    balanceDetail:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    self.setData({
      refType: options.refType
    })
    if (options.refType == 'BT060' || options.refType == 'BT061') {
      request.httpGet({
        url: config.getBalanceLogDetailUrl,
        data: { refId: options.refId, refType: options.refType },
        success: function (data) {
          console.log(data);
          if (data.success) {
            data.obj.amount = Util.fenToYuan(data.obj.amount);
            self.setData({
              balanceDetail: data.obj
            });
          }
        }
      })
    } else {
      var refTypeName, status = null;
      if (options.refType == 'BT101') {
        refTypeName = '派单钱包提现至微信零钱';
        status = options.handleStatus == 'HS01' ? '处理中' : (options.handleStatus == 'HS02' ? '已存入微信零钱' : '提现被驳回');
      } else {
        refTypeName = options.refType == 'BT051' ? '采购钱包转入到派单钱包' : '派单钱包转出到采购钱包';
      }
      self.setData({
        balanceDetail: {
          id: options.id,
          refTypeName: refTypeName,
          amount: options.amount.substr(1),
          status: status,
          addtime: Util.format(new Date(options.addtime.replace(/-/g, "/")), 'MM-dd HH:mm')
        }
      });
    }
    
    
  }
})