const Poloniex = require('poloniex.js');
const poloniex = new Poloniex();
const moment = require('moment');

const cur = [
    {
        objKey:'ZEC',
        tickerName:'BTC_ZEC'
    },
    {
        objKey:'XMR',
        tickerName:'BTC_XMR'
    },
    {
        objKey:'DASH',
        tickerName:'BTC_DASH'
    },
    {
        objKey:'ETH',
        tickerName:'BTC_ETH'
    },
    {
        objKey:'ETC',
        tickerName:'BTC_ETC'
    },
    {
        objKey:'LTC',
        tickerName:'BTC_LTC'
    }
];


const getPrices = function(callback){
    poloniex.returnTicker(function(err, data) {
        if (err){
            callback(err, null);
        }
        let price = {};
        for(let exchange in data){
            for(let i = 0; i < cur.length; i++){
                if(exchange === cur[i].tickerName){
                    price[cur[i].objKey] = data[exchange].highestBid;
                }
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