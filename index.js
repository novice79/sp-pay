
var SPPay = require('./lib/sppay');

SPPay.mix('Util', require('./lib/util'));

module.exports = SPPay;