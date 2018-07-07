
const util = require('./util');
const request = require('request');
const md5 = require('md5');
const moment = require('moment');

class SPPay {
	constructor(cfg) {
		// {
		// 	mch_id,
		// 	md5_key,
		// 	mch_pri_key,
		// 	mch_pub_key,
		// 	bank_pub_key
		// }
		if(cfg.mch_pri_key.indexOf('PRIVATE KEY') < 0){
			cfg.mch_pri_key = util.raw2pkcs8pem_pri(cfg.mch_pri_key)
		}
		if(cfg.mch_pub_key.indexOf('PUBLIC KEY') < 0){
			cfg.mch_pub_key = util.raw2pkcs8pem_pub(cfg.mch_pub_key)
		}
		if(cfg.bank_pub_key.indexOf('PUBLIC KEY') < 0){
			cfg.bank_pub_key = util.raw2pkcs8pem_pub(cfg.bank_pub_key)
		}
		this.conf = cfg
		this.util = util
		// console.log(this.conf)
	}
	//object to querystring
	querystring(data){
		const qs = Object.keys(data)
		.filter( key=>{
			return data[key] !== undefined && data[key] !== '' && ['pfx', 'sign', 'key'].indexOf(key)<0;
		})
		.sort()
		.map( key=> `${key}=${data[key]}`).join("&")
		return qs;
	}
	md5_sign( data ){
		data.sign_type = 'MD5';
		const qs = this.querystring(data) + "&key=" + this.conf.md5_key;	
		data.sign = md5(qs).toUpperCase();
		return data;
	}
	rsa_sign( data ){
		data.sign_type = 'RSA_1_256';
		const qs = this.querystring(data)	
		// console.log(qs)
		const hex_sign = util.rsa2_sign(this.conf.mch_pri_key, qs);
		//中信的sign还要转为base64格式
		data.sign = Buffer.from(hex_sign, 'hex').toString('base64')
		return data;
	}
	sign(data){
		if(this.conf.mch_pri_key){
			this.rsa_sign(data);
			// console.log(data)
		} else {
			this.md5_sign(data);
		}
	}
	verify_bank_rsa2(ret_data){
		const sign = Buffer.from(ret_data.sign, 'base64').toString('hex');
		delete ret_data.sign;
		const qs = this.querystring(ret_data)	
		return util.rsa2_verify(this.conf.bank_pub_key, qs, sign)
	}
	verify_bank_md5(ret_data){
		const sign = ret_data.sign;
		delete ret_data.sign;
		const qs = this.querystring(ret_data) + "&key=" + this.conf.md5_key;	
		return sign == md5(qs).toUpperCase();
	}
	verify_bank_data(ret_data){
		return ret_data.sign_type == 'MD5' ? this.verify_bank_md5(ret_data) : this.verify_bank_rsa2(ret_data);
	}
	get_wxpay_qr(data, cb){
		const now = moment();
		// console.log( now.format("YYYYMMDDHHmmss") )
		// const end = now.add(5, 'seconds');
		const end = now.add(3, 'minutes');
		// console.log( end.format("YYYYMMDDHHmmss") )
		const fix_data = {
			mch_id: this.conf.mch_id,
			nonce_str : util.generateNonceString(),
			service : 'pay.weixin.native'
			// ,time_start: now.format("YYYYMMDDHHmmss"),
			// time_expire: end.format("YYYYMMDDHHmmss")
		}
		Object.assign(data, fix_data);
		this.sign(data);
		request({
			url: "https://pay.swiftpass.cn/pay/gateway",
			method: 'POST',
			body: util.buildXML(data)
		}, (err, response, body)=>{
			if(err) console.error('get_wxpay_qr request failed, may be network failure')
			util.parseXML(body, cb);
		});
	}
	alipay_js_pay(data, cb){
		const fix_data = {
			mch_id: this.conf.mch_id,
			nonce_str : util.generateNonceString(),
			service : 'pay.alipay.jspay',
		}
		Object.assign(data, fix_data);
		this.sign(data);
		request({
			url: "https://pay.swiftpass.cn/pay/gateway",
			method: 'POST',
			body: util.buildXML(data)
		}, (err, response, body)=>{
			if(err) console.error('alipay_js_pay request failed, may be network failure')
			util.parseXML(body, cb);
		});
	}
	get_alipay_qr(data, cb){
		const now = moment();
		// const end = now.add(5, 'seconds');
		const end = now.add(3, 'minutes');
		const fix_data = {
			mch_id: this.conf.mch_id,
			nonce_str : util.generateNonceString(),
			service : 'pay.alipay.native'
			// ,time_start: now.format("YYYYMMDDHHmmss"),
			// time_expire: end.format("YYYYMMDDHHmmss")
		}
		Object.assign(data, fix_data);
		this.sign(data);
		request({
			url: "https://pay.swiftpass.cn/pay/gateway",
			method: 'POST',
			body: util.buildXML(data)
		}, (err, response, body)=>{
			if(err) console.error('get_alipay_qr request failed, may be network failure')
			util.parseXML(body, cb);
		});
	}
	get_unionpay_qr(data, cb){
		const now = moment();
		const end = now.add(3, 'minutes');
		const fix_data = {
			mch_id: this.conf.mch_id,
			nonce_str : util.generateNonceString(),
			service : 'pay.unionpay.native'
			// ,time_start: now.format("YYYYMMDDHHmmss"),
			// time_expire: end.format("YYYYMMDDHHmmss")
		}
		Object.assign(data, fix_data);
		this.sign(data);
		request({
			url: "https://pay.swiftpass.cn/pay/gateway",
			method: 'POST',
			body: util.buildXML(data)
		}, (err, response, body)=>{
			if(err) console.error('get_unionpay_qr request failed, may be network failure')
			util.parseXML(body, cb);
		});
	}
	get_qqpay_qr(data, cb){
		const now = moment();
		const end = now.add(3, 'minutes');
		const fix_data = {
			mch_id: this.conf.mch_id,
			nonce_str : util.generateNonceString(),
			service : 'pay.tenpay.native'
			// ,time_start: now.format("YYYYMMDDHHmmss"),
			// time_expire: end.format("YYYYMMDDHHmmss")
		}
		Object.assign(data, fix_data);
		this.sign(data);
		request({
			url: "https://pay.swiftpass.cn/pay/gateway",
			method: 'POST',
			body: util.buildXML(data)
		}, (err, response, body)=>{
			if(err) console.error('get_qqpay_qr request failed, may be network failure')
			util.parseXML(body, cb);
		});
	}
	req_qq_jspay(data, cb){
		const now = moment();
		const end = now.add(4, 'minutes');
		const fix_data = {
			mch_id: this.conf.mch_id,
			nonce_str : util.generateNonceString(),
			service : 'pay.tenpay.jspay',
			time_start: now.format("YYYYMMDDHHmmss"),
			time_expire: end.format("YYYYMMDDHHmmss")
		}
		Object.assign(data, fix_data);
		this.sign(data);
		request({
			url: "https://pay.swiftpass.cn/pay/gateway",
			method: 'POST',
			body: util.buildXML(data)
		}, (err, response, body)=>{
			if(err) console.error('req_qq_jspay request failed, may be network failure')
			util.parseXML(body, cb);
		});
	}
	get_wx_jspay_para(data, cb){
		const fix_data = {
			mch_id: this.conf.mch_id,
			nonce_str : util.generateNonceString(),
			service : 'pay.weixin.jspay',
			is_raw : 1
		}
		Object.assign(data, fix_data);
		this.sign(data);
		request({
			url: "https://pay.swiftpass.cn/pay/gateway",
			method: 'POST',
			body: util.buildXML(data)
		}, (err, response, body)=>{
			if(err) console.error('get_wx_jspay_para request failed, may be network failure')
			util.parseXML(body, cb);
		});
	}
	query_order_by_id(data, cb){
		const fix_data = {
			mch_id: this.conf.mch_id,
			nonce_str : util.generateNonceString(),
			service : 'unified.trade.query',
		}
		Object.assign(data, fix_data);
		this.sign(data);
		request({
			url: "https://pay.swiftpass.cn/pay/gateway",
			method: 'POST',
			body: util.buildXML(data)
		}, (err, response, body)=>{
			if(err) console.error('query_order_by_id request failed, may be network failure')
			util.parseXML(body, cb);
		});
	}
	refund_request(data, cb){
		const fix_data = {
			mch_id: this.conf.mch_id,
			nonce_str : util.generateNonceString(),
			service : 'unified.trade.refund',
			op_user_id : this.conf.mch_id,
		}
		Object.assign(data, fix_data);
		this.sign(data);
		request({
			url: "https://pay.swiftpass.cn/pay/gateway",
			method: 'POST',
			body: util.buildXML(data)
		}, (err, response, body)=>{
			if(err) console.error('refund_request request failed, may be network failure')
			util.parseXML(body, cb);
		});
	}
	refund_query(data, cb){
		const fix_data = {
			mch_id: this.conf.mch_id,
			nonce_str : util.generateNonceString(),
			service : 'unified.trade.refundquery',
		}
		Object.assign(data, fix_data);
		this.sign(data);
		request({
			url: "https://pay.swiftpass.cn/pay/gateway",
			method: 'POST',
			body: util.buildXML(data)
		}, (err, response, body)=>{
			if(err) console.error('refund_query request failed, may be network failure')
			util.parseXML(body, cb);
		});
	}
	reverse_order(data, cb){
		const fix_data = {
			mch_id: this.conf.mch_id,
			nonce_str : util.generateNonceString(),
			service : 'unified.micropay.reverse',
		}
		Object.assign(data, fix_data);
		this.sign(data);
		request({
			url: "https://pay.swiftpass.cn/pay/gateway",
			method: 'POST',
			body: util.buildXML(data)
		}, (err, response, body)=>{
			if(err) console.error('reverse_order request failed, may be network failure')
			util.parseXML(body, cb);
		});
	}
	close_order(data, cb){
		const fix_data = {
			mch_id: this.conf.mch_id,
			nonce_str : util.generateNonceString(),
			service : 'unified.trade.close',
		}
		Object.assign(data, fix_data);
		this.sign(data);
		request({
			url: "https://pay.swiftpass.cn/pay/gateway",
			method: 'POST',
			body: util.buildXML(data)
		}, (err, response, body)=>{
			if(err) console.error('close_order request failed, may be network failure')
			util.parseXML(body, cb);
		});
	}
	micropay(data, cb){
		const fix_data = {
			mch_id: this.conf.mch_id,
			nonce_str : util.generateNonceString(),
			service : 'unified.trade.micropay',
		}
		Object.assign(data, fix_data);
		this.sign(data);
		request({
			url: "https://pay.swiftpass.cn/pay/gateway",
			method: 'POST',
			body: util.buildXML(data)
		}, (err, response, body)=>{
			if(err) console.error('micropay request failed, may be network failure')
			util.parseXML(body, cb);
		});
	}
}

module.exports = SPPay;