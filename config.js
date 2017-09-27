/**
 * 小程序配置文件
 */

var protocol = "http", host = "127.0.0.1:8082";
//var protocol = "https", host = "www.qrun360.com";

var config = {

    // 下面的地址配合云端 Server 工作
    protocol,
    host,

    // 登录地址，用于建立会话
    loginUrl: `${protocol}://${host}/api/deliver/account/login`,

    // 获取验证码
    getVcodeUrl: `${protocol}://${host}/api/deliver/account/getVcode`,

    // 生成支付订单的接口
    paymentUrl: `${protocol}://${host}/payment`,

    // 发送模板消息接口
    templateMessageUrl: `${protocol}://${host}/templateMessage`,

    // 上传文件接口
    uploadFileUrl: `${protocol}://${host}/upload`,
};

module.exports = config
