var socket;
var btcPrice = 0;
var chartData = {};
var charts = {};
var coins = {};


$(function () {
    $(window).resize(function () {
        sizeFix();
    });
    // first get coins config
    $.get('/coins.json', function (data) {
        console.log(data);
        socket = io();
        coins = data;
        buildPriceBoxes();
        // var socket = io();
        socket.on('chartData', function (data) {
            // console.log(data);
            chartData = data;
            for (let ticker in chartData) {
                if (ticker === 'BTC') {
                    makeGraph(chartData.BTC, ticker, coins[ticker].color.text, false);
                } else {
                    makeGraph(chartData[ticker], ticker, coins[ticker].color.text, chartData.BTC);
                }
            }
        });
        socket.on('bitcoinPrice', function (bitcoinPrice) {
            $('.bitcoin-price').html(formatNumber(bitcoinPrice));
            btcPrice = parseFloat(bitcoinPrice);
        });
        socket.on('altPrices', function (price) {
            for(var key in price){
                $('.'+key+'-price').html(parseFloat(price[key]).toFixed(8));
                $('.'+key+'-usd-price').html(btcToUsd(price[key]));
                $('.bitcoin-price-box.'+key+'').attr('data-price', parseFloat(price[key]).toFixed(8) * 100000000);
            }
            // sort them sortDivs
            sortDivs();
        });
        socket.on('reload', function (data) {
            location.reload();
        });
        sizeFix();
    });
});

function buildPriceBoxes() {
    var str = '';
    console.log(coins);
    for(var key in coins) {
        if (key !== 'BTC') {
            str += '<div class="bitcoin-price-box ' + key + '" data-price="0" style="background:'+coins[key].color.background+'">' +
                '<div class="row">' +
                '<div class="col-xs-4 logo-box">' +
                '<div class="coin-logo" style="background-image:url(/img/' + coins[key].logo + ')"></div>' +
                '</div>' +
                '<div class="col-xs-4 text-center price-box">' +
                '<div class="graph-box">' +
                '<canvas id="'+key+'-canvas"></canvas>' +
                '</div>' +
                '</div>' +
                '<div class="col-xs-4 text-center price-box">' +
                '<div class="price" style="color:'+coins[key].color.text+'">' +
                '$<span class="'+key+'-usd-price"></span>' +
                '<div class="price2">' +
                '<i class="fa fa-btc" aria-hidden="true"></i> <span class="'+key+'-price"></span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }
    }
    $('#sortable').html(str);
}

function btcToUsd(btcAmount) {
    return formatNumber((parseFloat(btcAmount) * btcPrice).toFixed(2));
}

function formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var bitcoinPrice = 0;


function sortDivs() {
    // tinysort(child_nodes,{attr:'data-price'});
    $('div#sortable>.bitcoin-price-box').tsort({attr: 'data-price', order: 'desc'});
    // console.log($('.sortable').children('.bitcoin-price-box'));
}


function sizeFix() {
    var n = $('.bitcoin-price-box').length;
    // console.log('There are '+ n + ' divs');
    var heights = $(window).height() / n;
    $('.bitcoin-price-box').height(heights);
    $('.bitcoin-price-box .title').css({
        lineHeight: heights + 'px'
    });
    $('.bitcoin-price-box').css({
        lineHeight: heights + 'px'
    });
    $('.bitcoin-price-box .price').css({
        // lineHeight:heights+'px',
        fontSize: heights < 110 ? (heights * .9) + 'px' : '110px'
    });
    textFill();
}
function textFill() {
    //smallest size
    var smallestSize = 120;
    var topPercent = 0.7;
    var $this = $('.price').first();
    var $parent = $('.price').first().parent();

    if ($this.height() > $parent.height()) {
        $('.price').css('fontSize', ($parent.height() * topPercent) + 'px');
    } else {
        $('.price').css('fontSize', ($this.height() * topPercent) + 'px');
    }
    // var size = $( document ).width() *.05;
    // $('.price').css('fontSize',size + 'px').css('lineHeight', $('.price').height()+'px');
}

function mapValue(yValue, yMin, yMax, xMin, xMax) {
    var percent = (yValue - yMin) / (yMax - yMin);
    return percent * (xMax - xMin) + xMin;
}

function makeGraph(data, ticker, color, compare) {
    console.log(ticker);
    // do price
    var labels = [];
    var points = [];
    var highest = 0;
    var lowest = 999999999999999999;
    for (var i = 0; i < data.price.length; i++) {
        var price;
        if (compare) {
            price = data.price[i].open * compare.price[i].open;
        } else {
            price = data.price[i].open;
        }
        labels.push(data.price[i].date);
        points.push({x: moment(data.price[i].date), y: price});
        if (price > highest) {
            highest = price;
        }
        if (price < lowest) {
            lowest = price;
        }
    }
    // // do trends
    // var trendLabels = [];
    // var trendPoints = [];
    // var trendHighest = 0;
    // var trendLowest = 999999999999999999;
    // var thisValue;
    //
    // // determine high and low for trends
    // for (var i = 0; i < data.googleTrend.length; i++) {
    //     thisValue = data.googleTrend[i].value;
    //     if (thisValue > trendHighest) {
    //         trendHighest = thisValue;
    //     }
    //     if (thisValue < trendLowest) {
    //         trendLowest = thisValue;
    //     }
    // }
    //
    // for (var i = 0; i < data.googleTrend.length; i++) {
    //     thisValue = data.googleTrend[i].value;
    //     // new value mapped to price
    //     thisValue = mapValue(thisValue, 0, trendHighest, lowest, highest);
    //     trendLabels.push(data.googleTrend[i].date);
    //     trendPoints.push({x: moment(data.googleTrend[i].date), y: thisValue});
    // }

    var config = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                //     {
                //     backgroundColor: 'rgba(255,255,255,0.8)',
                //     borderColor: 'rgba(255,255,255,0.8)',
                //     data: trendPoints,
                //     fill: false,
                //     radius: 0,
                //     borderWidth: 1
                // },
                {
                    backgroundColor: color,
                    borderColor: color,
                    data: points,
                    fill: true,
                    radius: 0
                }
            ]
        },
        options: {
            animation: false,
            legend: {
                display: false
            },
            responsive: true,
            title: {
                display: false
            },
            scales: {
                yAxes: [{
                    display: false
                }],
                xAxes: [{
                    display: false,
                    type: "time",
                    ticks: {
                        min: lowest * .99,
                        max: highest * 1.01
                    }
                }]
            }
        }
    };
    var ctx = document.getElementById(ticker + "-canvas").getContext("2d");
    $('#' + ticker + '-canvas').siblings('.chartjs-hidden-iframe').remove();
    charts[ticker] = new Chart(ctx, config);
}