var openIdUrl = require('./config').openIdUrl;

App({
  onLaunch: function () {
    // console.log('App Launch')
  },
  onShow: function () {
    // console.log('App Show')
  },
  onHide: function () {
    // console.log('App Hide')
  },
  globalData: {
    openid: null,
    tokenId: null
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
