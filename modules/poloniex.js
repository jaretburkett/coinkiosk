var Poloniex = require('poloniex.js');
var poloniex = new Poloniex();


var getPrices = function(callback){
    poloniex.returnTicker(function(err, data) {
        if (err){
            callback(err, null);
        }
        var price = {};
        for(var exchange in data){
            switch (exchange){
                case 'BTC_ZEC':
                    price.ZEC = data[exchange].highestBid;
                    break;
                case 'BTC_XMR':
                    price.XMR = data[exchange].highestBid;
                    break;
                case 'BTC_DASH':
                    price.DASH = data[exchange].highestBid;
                    break;
                case 'BTC_ETH':
                    price.ETH = data[exchange].highestBid;
                    break;
                case 'BTC_ETC':
                    price.ETC = data[exchange].highestBid;
                    break;
                case 'BTC_LTC':
                    price.LTC = data[exchange].highestBid;
                    break;
            }
        }
        callback(false,price);
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