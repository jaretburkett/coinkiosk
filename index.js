var express = require('express');
var app = express();
var path = require('path');
var coinbase = require('./modules/coinbase');
var polo = require('./modules/poloniex');
var sassMiddleware = require('node-sass-middleware');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;


var bitcoinPrice = 0;
var bitcoinHistorical={};
var isFirstRun = true;

var CoinDesk = require("node-coindesk");
var coindesk = new CoinDesk();

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
    getBTCPrice();
    getPoloPrices();
    if(isFirstRun){
        // send websocket reload on app boot
        io.emit('reload', true);
        isFirstRun = false;
    }
});

function getBTCPrice() {
    coinbase.getBTCprice(function(err, price){
        try{
            io.emit('bitcoinPrice', price.toFixed(2));
        } catch(e){

        }
    });
}
function getPoloPrices() {
    polo.getPrices(function(err, price){
        try{
            io.emit('poloPrices', price);
        } catch(e){

        }
    });
}

// get bitcoin prices
getBTCPrice();
getPoloPrices();

setInterval(function () {
    getBTCPrice();
    getPoloPrices();
}, 60000);

http.listen(port, function(){
    console.log('listening on *:' + port);
});

// send websocket reload on app boot
io.emit('reload', true);