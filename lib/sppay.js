
var util = require('./util');
var request = require('request');
var md5 = require('md5');

exports = module.exports = SPPay;

function SPPay() {	
	this.options = arguments[0];
	this.fix_para = { 
		mch_id : this.options.mch_id
	};
};

SPPay.mix = function(){
	
	switch (arguments.length) {
		case 1:
			var obj = arguments[0];
			for (var key in obj) {
				if (SPPay.prototype.hasOwnProperty(key)) {
					throw new Error('Prototype method exist. method: '+ key);
				}
				SPPay.prototype[key] = obj[key];
			}
			break;
		case 2:
			var key = arguments[0].toString(), fn = arguments[1];
			if (SPPay.prototype.hasOwnProperty(key)) {
				throw new Error('Prototype method exist. method: '+ key);
			}
			SPPay.prototype[key] = fn;
			break;
	}
};


SPPay.mix('option', function(option){
	for( var k in option ) {
		this.options[k] = option[k];
	}
});


SPPay.mix('sign', function(param){

	var querystring = Object.keys(param).filter(function(key){
		return param[key] !== undefined && param[key] !== '' && ['pfx', 'partner_key', 'sign', 'key'].indexOf(key)<0;
	}).sort().map(function(key){
		return key + '=' + param[key];
	}).join("&") + "&key=" + this.options.partner_key;

	return md5(querystring).toUpperCase();
});


SPPay.mix('get_wxpay_qr', function(opts, fn){
	opts.nonce_str = opts.nonce_str || util.generateNonceString();
	util.mix(opts, this.fix_para);
	opts.service = 'pay.weixin.native';
	opts.sign = this.sign(opts);
	request({
		url: "https://pay.swiftpass.cn/pay/gateway",
		method: 'POST',
		body: util.buildXML(opts)
	}, function(err, response, body){
		util.parseXML(body, fn);
	});
});
SPPay.mix('get_alipay_qr', function(opts, fn){
	opts.nonce_str = opts.nonce_str || util.generateNonceString();
	util.mix(opts, this.fix_para);
	opts.service = 'pay.alipay.native';
	opts.sign = this.sign(opts);
	request({
		url: "https://pay.swiftpass.cn/pay/gateway",
		method: 'POST',
		body: util.buildXML(opts)
	}, function(err, response, body){
		util.parseXML(body, fn);
	});
});
SPPay.mix('get_wx_jspay_para', function(opts, fn){
	opts.nonce_str = opts.nonce_str || util.generateNonceString();
	util.mix(opts, this.fix_para);
	opts.service = 'pay.weixin.jspay';
	opts.is_raw = 1;
	opts.sign = this.sign(opts);
	request({
		url: "https://pay.swiftpass.cn/pay/gateway",
		method: 'POST',
		body: util.buildXML(opts)
	}, function(err, response, body){
		util.parseXML(body, fn);
	});
});
SPPay.mix('query_order_by_id', function(opts, fn){
	opts.nonce_str = opts.nonce_str || util.generateNonceString();
	util.mix(opts, this.fix_para);
	opts.service = 'unified.trade.query';
	opts.sign = this.sign(opts);
	request({
		url: "https://pay.swiftpass.cn/pay/gateway",
		method: 'POST',
		body: util.buildXML(opts)
	}, function(err, response, body){
		util.parseXML(body, fn);
	});
});

SPPay.mix('refund_request', function(opts, fn){
	opts.nonce_str = opts.nonce_str || util.generateNonceString();
	util.mix(opts, this.fix_para);
	opts.service = 'unified.trade.refund';
	opts.op_user_id = this.fix_para.mch_id;
	opts.sign = this.sign(opts);
	request({
		url: "https://pay.swiftpass.cn/pay/gateway",
		method: 'POST',
		body: util.buildXML(opts)
	}, function(err, response, body){
		util.parseXML(body, fn);
	});	
});
SPPay.mix('query_refund_status', function(opts, fn){
	opts.nonce_str = opts.nonce_str || util.generateNonceString();
	util.mix(opts, this.fix_para);
	opts.service = 'unified.trade.refundquery';
	opts.sign = this.sign(opts);
	request({
		url: "https://pay.swiftpass.cn/pay/gateway",
		method: 'POST',
		body: util.buildXML(opts)
	}, function(err, response, body){
		util.parseXML(body, fn);
	});	
});
SPPay.mix('close_order', function(opts, fn){
	opts.nonce_str = opts.nonce_str || util.generateNonceString();
	util.mix(opts, this.fix_para);
	opts.service = 'unified.micropay.reverse';
	opts.sign = this.sign(opts);
	request({
		url: "https://pay.swiftpass.cn/pay/gateway",
		method: 'POST',
		body: util.buildXML(opts)
	}, function(err, response, body){
		util.parseXML(body, fn);
	});	
});
SPPay.mix('micropay', function(opts, fn){
	opts.nonce_str = opts.nonce_str || util.generateNonceString();
	util.mix(opts, this.fix_para);
	opts.service = 'unified.trade.micropay';
	opts.sign = this.sign(opts);
	request({
		url: "https://pay.swiftpass.cn/pay/gateway",
		method: 'POST',
		body: util.buildXML(opts)
	}, function(err, response, body){
		util.parseXML(body, fn);
	});	
});
SPPay.mix('refund_query', function(opts, fn){
	opts.nonce_str = opts.nonce_str || util.generateNonceString();
	util.mix(opts, this.fix_para);
	opts.service = 'unified.trade.refundquery';
	opts.sign = this.sign(opts);
	request({
		url: "https://pay.swiftpass.cn/pay/gateway",
		method: 'POST',
		body: util.buildXML(opts)
	}, function(err, response, body){
		util.parseXML(body, fn);
	});	
});