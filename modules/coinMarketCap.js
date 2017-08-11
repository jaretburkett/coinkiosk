const request = require('request-json');
const CMC = request.createClient('https://api.coinmarketcap.com');


var getPrices = function(callback){
    var price = {};
    CMC.get('/v1/ticker/bitcoin-cash/', function(err, res, body) {
        if(err) callback(err, null);
        else {
            price.BCH = body[0]['price_btc'];
            callback(false, price);

        }
    });
};

function test(){
    getPrices(function(err, data){
        console.log(data);
    });
}

if (require.main === module) {
    test();
}

module.exports.getPrices = getPrices;