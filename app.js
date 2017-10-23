var openIdUrl = require('./config').openIdUrl;

App({
  onLaunch: function () {
    var self = this;
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        self.globalData.network.networkType = res.networkType
      }
    })
    // console.log('App Launch')
    wx.onNetworkStatusChange(function (res) {
      self.globalData.network = {
        isConnected: res.isConnected,
        networkType: res.networkType
      }
    })
  },
  onShow: function () {
    // console.log('App Show')
  },
  onHide: function () {
    // console.log('App Hide')
  },
  globalData: {
    openid: null,
    tokenId: null,
    network:{
      isConnected:true,
      networkType:''
    }
  },
  
  /**
   * scope:权限的scope 
   * content：拒绝授权的提示信息
   * required ： 授权是否必须
   * callback : 授权成功回调函数
   */
  getAuthorize : function(opts) {
    var self = this, scope = opts.scope;
    wx.getSetting({
      success(res) {
        if (!res.authSetting[scope]) {
          wx.authorize({
            scope: scope,
            success(res) {
              self.getAuthorize(opts);
            },
            fail() {
              wx.showModal({
                content: opts.content,
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success(res) {
                        res.authSetting = {
                          scope: true
                        }
                      }
                    })
                  } else if (res.cancel) {
                    if (opts.required) self.getAuthorize(opts);
                  }
                }
              });
            }
          })
        } else {
          if(opts.callback)
            opts.callback();
        }
      }
    })
  }
})
