const express = require('express');
const app = express();
const path = require('path');
const coinbase = require('./modules/coinbase');
const polo = require('./modules/poloniex');
const sassMiddleware = require('node-sass-middleware');
const http = require('http').Server(app);
const cmc = require('./modules/coinMarketCap');
const io = require('socket.io')(http);
const port = process.env.PORT || 8484;

let isFirstRun = true;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, 'scss'),
    dest: path.join(__dirname, 'public'),
    debug: true,
    outputStyle: 'compressed',
}));
// Note: you must place sass-middleware *before* `express.static` or else it will
// not work.
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, 'bower_components')));


// websocket stuff
io.on('connection', function(socket){
    sendPrices();
    if(isFirstRun){
        // send websocket reload on app boot
        io.emit('reload', true);
        isFirstRun = false;
    }
});

let bitcoinPrice = '1';
let altCoinPrices = {};

function getPrices() {
    coinbase.getBTCprice(function(err, price){
        if(err) {
            console.log(err);
        }else {
            bitcoinPrice = price.toFixed(2);
        }
        getAtlcoins();
    });
}
function getPoloPrices(callback) {
    polo.getPrices(function(err, price){
        if(err){
            console.log(err);
        } else {
            for(let ticker in price){
                altCoinPrices[ticker] = price[ticker];
            }
        }
        callback();
    });
}

function getCoinMarketCapPrices(callback){
    cmc.getPrices(function(err, price){
        if(err){
            console.log(err);
        } else {
            for(let ticker in price){
                altCoinPrices[ticker] = price[ticker];
            }
        }
        callback();
    });
}

function getAtlcoins(){
    getPoloPrices(function(){
        getCoinMarketCapPrices(function(){
            sendPrices();
        })
    });
}

function sendPrices(){
    io.emit('bitcoinPrice', bitcoinPrice);
    setTimeout(function(){
        io.emit('altPrices', altCoinPrices);
    }, 1000);
}

// get bitcoin prices
getPrices();

setInterval(function () {
    getPrices();
}, 60000);

http.listen(port, function(){
    console.log('listening on *:' + port);
});

// send websocket reload on app boot
io.emit('reload', true);