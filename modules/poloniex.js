const Poloniex = require('poloniex.js');
const poloniex = new Poloniex();
const moment = require('moment');

const request = require('request-json');
const polo = request.createClient('https://poloniex.com');

const chartData={};

const cur = [
    {
        objKey:'BTC',
        tickerName:'USDT_BTC'
    },
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
    },
    {
        objKey:'BCH',
        tickerName:'BTC_BCH'
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

function getAllCharts(pos, callback) {
    // console.log('fetching '+ cur[pos].tickerName);
    const startDate = moment().subtract(1, 'd').format('X');
    if(pos  >= cur.length){
        callback(false);
    } else {
        polo.get('/public?command=returnChartData&currencyPair='+cur[pos].tickerName+'&start='+startDate+'&end=9999999999&period=300', function(err, res, body) {
            if(err) callback(err);
            else {
                chartData[cur[pos].objKey] = body;
                getAllCharts(pos+1, callback);
            }
        });
    }
}

const getChartData = function(callback){
    getAllCharts(0,function(err){
        callback(err, chartData);
    })
};


function test(){
    getChartData(function(err, data){
        if(err){
            console.log('Error:', err);
        }
        console.log(data);
    });
}

if (require.main === module) {
    test();
}

module.exports.getChartData = getChartData;
module.exports.getPrices = getPrices;