/**
 * 小程序配置文件
 */

var server_host = "http://127.0.0.1:8082";
// var server_host = "http://10.42.0.99:8082";
// var server_host = "https://www.qrun360.com";

var config = {

    // 下面的地址配合云端 Server 工作
    server_host,

    // 登录地址，用于建立会话
    loginUrl: `${server_host}/api/deliver/account/login`,

    // 获取验证码
    getVcodeUrl: `${server_host}/api/deliver/account/getVCode`,

    // 注册地址
    regUrl: `${server_host}/api/deliver/account/register`,

    // 获取门店信息列表
    getShopsUrl: `${server_host}/testData/shops.txt`,

    // 绑定门店申请
    addShopApplyUrl: `${server_host}/api/deliver/account/addShopApply`,

    // 获取门店信息
    getShopApplyUrl: `${server_host}/api/deliver/account/getShopApply`,

    // 获取用户信息
    getAccountInfoUrl: `${server_host}/api/deliver/account/get`,

    // 更新用户信息
    updateAccountUrl: `${server_host}/api/deliver/account/edit`,

    // 新订单列表查询
    newOrdersUrl: `${server_host}/testData/orders.txt`,

    // 拒绝订单
    refuseOrderUrl: `${server_host}/api/deliver/order/refuseOrder`,

    // 商品管理列表
    getItemsUrl: `${server_host}/testData/items.txt`,
};

module.exports = config
