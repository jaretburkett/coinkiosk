var request = require('request-json');
var coinbase = request.createClient('https://api.coinbase.com');

var getBTCPrice = function(callback){
    coinbase.get('/v2/prices/spot?currency=USD', function(err, res, body) {
        if(err) callback(err, null);
        else {
            callback(false, parseFloat(body.data.amount));
        }
    });
};


function test(){
    getBTCPrice(function(err, data){
        console.log(data);
    });
}

if (require.main === module) {
    test();
}

module.exports.getBTCprice = getBTCPrice;