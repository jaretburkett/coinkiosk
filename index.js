var express = require('express');
var app = express();
var path = require('path');
var coinbase = require('./modules/coinbase');
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
    getPrice();
    getBitcoinHistorical();
    if(isFirstRun){
        // send websocket reload on app boot
        io.emit('reload', true);
        isFirstRun = false;
    }
});

function getBitcoinHistorical() {
    var start_date = new Date();
    var end_date = new Date();
    end_date.setDate(start_date.getDate() - 30);
    coindesk.historical({start_date: start_date, end_date: end_date}, function (data) {
        try {
            data = JSON.parse(data);
            bitcoinHistorical = data.bpi;
            console.log(data);
            io.emit('bitcoinHistorical', bitcoinHistorical);
        } catch(e){

        }

    });
}

function getPrice() {
    coinbase.getBTCprice(function(err, price){
        try{
            io.emit('bitcoinPrice', price);
        } catch(e){

        }
    });
    //
    // coindesk.currentPrice(function (data) {
    //     try{
    //         data = JSON.parse(data);
    //         bitcoinPrice = data.bpi.USD.rate_float.toFixed(2);
    //         io.emit('bitcoinPrice', bitcoinPrice);
    //     } catch(e){
    //
    //     }
    // });
}

// get bitcoin prices
getPrice();
getBitcoinHistorical();
setInterval(function () {
    getPrice();
    getBitcoinHistorical();
}, 60000);

http.listen(port, function(){
    console.log('listening on *:' + port);
});

// send websocket reload on app boot
io.emit('reload', true);