# swiftpass-pay
中信威富通 for node.js

## Installation
```
npm install sp-pay -S
```

## Usage

获取微信正扫二维码
```js
var SPPay = require('sp-pay');

var sp_pay = new SPPay({
	mch_id: '1234567890',
	partner_key: 'xxxxxxxxxxxxxxxxx' //威富通平台API密钥
});

sp_pay.get_wxpay_qr({
	body: '扫码支付测试',
	out_trade_no: '20160203'+Math.random().toString().substr(2, 10),
	total_fee: 1,
	spbill_create_ip: '192.168.2.210',
	notify_url: 'http://wxpay_notify_url'
}, function(err, result){
	console.log(result);
});
```
获取支付宝正扫二维码
```js
var SPPay = require('sp-pay');

var sp_pay = new SPPay({
	mch_id: '1234567890',
	partner_key: 'xxxxxxxxxxxxxxxxx' //威富通平台API密钥
});

sp_pay.get_alipay_qr({
	body: '扫码支付测试',
	out_trade_no: '20160203'+Math.random().toString().substr(2, 10),
	total_fee: 1,
	spbill_create_ip: '192.168.2.210',
	notify_url: 'http://alipay_notify_url'
}, function(err, result){
	console.log(result);
});
```

查询订单
```js
// 通过订单号查
sp_pay.query_order_by_id({ transaction_id:"xxxxxx" }, function(err, order){
	console.log(order);
});

// 通过商户订单号查
sp_pay.query_order_by_id({ out_trade_no:"xxxxxx" }, function(err, order){
	console.log(order);
});
```

关闭订单
```js
sp_pay.close_order({ out_trade_no:"xxxxxx"}, function(err, result){
	console.log(result);
});
```
退款接口
```js
var params = {
	mch_id: '1234567890',
    op_user_id: '商户号即可',
    out_refund_no: '20160203'+Math.random().toString().substr(2, 10),
    total_fee: '1', //原支付金额
    refund_fee: '1', //退款金额
    transaction_id: '微信订单号'
};

sp_pay.refund_request(params, function(err, result){
    console.log('refund', arguments);
});
```
