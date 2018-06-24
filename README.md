# swiftpass-pay
中信银行支付 for node.js v8.0+

## Installation
```
npm install sp-pay -S
```

## Usage
设置商户信息，中信开通账户后会给一个商户id和md5密钥，
如果想用rsa2签名，需自己生成公、私钥对，并在商户后台上传公钥，上传公钥后可在后台查看银行公钥
可使用sp_pay.util.gen_keys();生成密钥，生成的密钥信息保存在keys目录下，然后将keys/pub_key_pkcs8_raw.txt的信息提交至银行商户后台
```js
const SPPay = require('sp-pay');
const mch_data = {
    mch_id: '商户id',
	md5_key: '商户md5密钥',
	//以下3项可选，如果以下3项为null，则用md5签名，否则用RSA_1_256签名
    mch_pri_key: '商户私钥',
    mch_pub_key: '商户公钥',
    bank_pub_key: '银行公钥'
}
const sp_pay = new SPPay(mch_data);
```
获取微信正扫二维码
```js
sp_pay.get_wxpay_qr({
	body: '扫码支付测试',
	out_trade_no: '20160203'+Math.random().toString().substr(2, 10),
	total_fee: 1,
	spbill_create_ip: '192.168.2.210',
	notify_url: 'http://wxpay_notify_url'
}, function(err, result){
	console.log(result);
	//验证银行签名
	const is_valid = sp_pay.verify_bank_data(result)
	console.log('is_valid = ' + is_valid)
});
```
获取支付宝正扫二维码
```js
sp_pay.get_alipay_qr({
	body: '扫码支付测试',
	out_trade_no: '20160203'+Math.random().toString().substr(2, 10),
	total_fee: 1,
	spbill_create_ip: '192.168.2.210',
	notify_url: 'http://alipay_notify_url'
}, function(err, result){
	//验证银行签名
	const is_valid = sp_pay.verify_bank_data(result)
	console.log('is_valid = ' + is_valid)
	console.log(result);
});
```

查询订单状态
```js
// 通过订单号查
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
const params = {
	out_refund_no: '订单号',
	out_refund_no: '退款单号',
    total_fee: '1', //原支付金额
	refund_fee: '1', //退款金额    
	op_user_id: '张三' //操作员
};

sp_pay.refund_request(params, function(err, result){
    console.log('refund', arguments);
});
```
返回结果验签，对银行返回的数据(json)，可使用以下方法验签
```js
const is_valid = sp_pay.verify_bank_data(result)
console.log('is_valid = ' + is_valid)
```