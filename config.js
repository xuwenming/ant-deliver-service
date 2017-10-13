/**
 * 小程序配置文件
 */

//var server_host = "http://127.0.0.1:8082";
// var server_host = "http://10.42.0.99:8082";
var server_host = "https://www.qrun360.com";

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
    // getShopsUrl: `${server_host}/testData/shops.txt`,
    getShopsUrl: `${server_host}/api/deliver/shop/dataGrid`,

    // 绑定门店申请
    addShopApplyUrl: `${server_host}/api/deliver/account/addShopApply`,

    // 获取门店信息
    getShopApplyUrl: `${server_host}/api/deliver/account/getShopApply`,

    // 获取用户信息
    getAccountInfoUrl: `${server_host}/api/deliver/account/get`,

    // 更新用户信息
    updateAccountUrl: `${server_host}/api/deliver/account/edit`,

    // 订单列表查询
    getOrdersUrl: `${server_host}/api/deliver/deliverOrder/dataGrid`,
    // getOrdersUrl: `${server_host}/testData/orders.txt`,

    // 拒绝订单
    refuseOrderUrl: `${server_host}/api/deliver/deliverOrder/editOrderRefuse`,

    // 开始接单
    acceptOrderUrl: `${server_host}/api/deliver/deliverOrder/editOrderAccept`,

    // 订单发货
    deliverOrderUrl: `${server_host}/api/deliver/deliverOrder/editOrderSendOut`,

    // 订单送达完成
    completeOrderUrl: `${server_host}/api/deliver/deliverOrder/editOrderComplete`,

    // 商品管理列表-全部
    getAllItemsUrl: `${server_host}/api/deliver/item/getAllItemList`,

    // 商品管理列表-上架
    getOnlineItemsUrl: `${server_host}/api/deliver/item/getShopItemOnline`,

    // 商品管理列表-下架
    getOfflineItemsUrl: `${server_host}/api/deliver/item/getShopItemOffline`,

    // 获取钱包余额
    getBalanceUrl: `${server_host}/api/deliver/deliverBalance/viewBalance`,

    // 转入/转出短信验证码
    getBalanceRollVcodeUrl: `${server_host}/api/deliver/deliverBalance/getVCode`,

    // 账户明细列表
    getBalanceLogsUrl: `${server_host}/api/deliver/deliverBalance/viewDeliverBanlanceLogDataGrid`,

    // 账户明细详情
    getBalanceLogDetailUrl: `${server_host}/api/deliver/deliverBalance/viewDeliverBanlanceLogDetial`,
};

module.exports = config
