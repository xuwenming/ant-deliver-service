// page/component/printer-bind/printer-bind.js
var config = require('../../../config');
var request = require('../../common/request');
var Util = require('../../../util/util').Util;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    machineCode:'',
    msign:'',
    bindBtn: {
      disabled: true,
      loading: false
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.machineCode)
      this.setData({
        machineCode: options.machineCode
      });
  },

  setMachineCode: function (e) {
    var machineCode = e.detail.value;
    if (!Util.isEmpty(machineCode)) {
      this.setData({
        machineCode: machineCode
      });
      if (!Util.isEmpty(this.data.msign)) {
        this.setData({
          'bindBtn.disabled': false,
        });
      }
    } else {
      this.setData({
        'bindBtn.disabled': true,
        machineCode: ''
      });
    }
  },

  setMsign: function (e) {
    var msign = e.detail.value;
    if (!Util.isEmpty(this.data.machineCode)) {
      if (!Util.isEmpty(msign)) {
        this.setData({
          'bindBtn.disabled': false,
          msign: msign
        });
      } else {
        this.setData({
          'bindBtn.disabled': true
        });
      }
    } else {
      this.setData({
        msign: msign
      });
    }
  },

  bindMachine: function (e) {
    var self = this;
    this.setData({
      'bindBtn.loading': true
    });
    var params = e.detail.value;
    request.httpPost({
      url: config.addPrinterUrl,
      data: params,
      success: function (data) {
        if (data.success) {
          wx.navigateBack({
            delta: 1,
          })
        } else {
          wx.showModal({
            content: data.msg,
            showCancel: false
          });
          self.setData({
            'bindBtn.loading': false
          });
        }
      }
    })
  }
})