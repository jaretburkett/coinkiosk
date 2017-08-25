var socket = io();
var btcPrice = 0;
var chartData = {};
var charts = {};


$(function () {
    $(window).resize(function () {
        sizeFix();
    });
    // var socket = io();
    socket.on('chartData', function (data) {
        console.log(data);
        chartData = data;
        for (let ticker in chartData) {
            if (ticker === 'BTC') {
                makeGraph(chartData.BTC, ticker, chartData.BTC.color.text, false);
            } else {
                makeGraph(chartData[ticker], ticker, chartData[ticker].color.text, chartData.BTC);
            }
        }
    });
    socket.on('bitcoinPrice', function (bitcoinPrice) {
        $('.bitcoin-price').html(formatNumber(bitcoinPrice));
        btcPrice = parseFloat(bitcoinPrice);
    });
    socket.on('altPrices', function (price) {
        $('.bch-price').html(parseFloat(price.BCH).toFixed(8));
        $('.bch-usd-price').html(btcToUsd(price.BCH));
        $('.bitcoin-price-box.bch').attr('data-price', parseFloat(price.BCH).toFixed(8) * 100000000);

        $('.etherium-price').html(parseFloat(price.ETH).toFixed(8));
        $('.etherium-usd-price').html(btcToUsd(price.ETH));
        $('.bitcoin-price-box.etherium').attr('data-price', parseFloat(price.ETH).toFixed(8) * 100000000);

        $('.etheriumClassic-price').html(parseFloat(price.ETC).toFixed(8));
        $('.etheriumClassic-usd-price').html(btcToUsd(price.ETC));
        $('.bitcoin-price-box.etheriumClassic').attr('data-price', parseFloat(price.ETC).toFixed(8) * 100000000);

        $('.ltc-price').html(parseFloat(price.LTC).toFixed(8));
        $('.ltc-usd-price').html(btcToUsd(price.LTC));
        $('.bitcoin-price-box.ltc').attr('data-price', parseFloat(price.LTC).toFixed(8) * 100000000);

        $('.zcash-price').html(parseFloat(price.ZEC).toFixed(8));
        $('.zcash-usd-price').html(btcToUsd(price.ZEC));
        $('.bitcoin-price-box.zcash').attr('data-price', parseFloat(price.ZEC).toFixed(8) * 100000000);

        $('.dash-price').html(parseFloat(price.DASH).toFixed(8));
        $('.dash-usd-price').html(btcToUsd(price.DASH));
        $('.bitcoin-price-box.dash').attr('data-price', parseFloat(price.DASH).toFixed(8) * 100000000);

        $('.monero-price').html(parseFloat(price.XMR).toFixed(8));
        $('.monero-usd-price').html(btcToUsd(price.XMR));
        $('.bitcoin-price-box.monero').attr('data-price', parseFloat(price.XMR).toFixed(8) * 100000000);

        $('.xrp-price').html(parseFloat(price.XRP).toFixed(8));
        $('.xrp-usd-price').html(btcToUsd(price.XRP));
        $('.bitcoin-price-box.ripple').attr('data-price', parseFloat(price.XRP).toFixed(8) * 100000000);

        // sort them sortDivs
        sortDivs();
    });
    socket.on('reload', function (data) {
        location.reload();
    });
    sizeFix();
});

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

function mapValue(yValue, yMin,yMax, xMin, xMax){
    var percent = (yValue - yMin) / (yMax - yMin);
    return percent * (xMax - xMin) + xMin;
}

function makeGraph(data, ticker, color, compare) {
    console.log(data);
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
    // do trends
    var trendLabels = [];
    var trendPoints = [];
    var trendHighest = 0;
    var trendLowest = 999999999999999999;
    var thisValue;

    // determine high and low for trends
    for (var i = 0; i < data.googleTrend.length; i++) {
        thisValue = data.googleTrend[i].value;
        if (thisValue > trendHighest) {
            trendHighest = thisValue;
        }
        if (thisValue < trendLowest) {
            trendLowest = thisValue;
        }
    }

    for (var i = 0; i < data.googleTrend.length; i++) {
        thisValue = data.googleTrend[i].value;
        // new value mapped to price
        thisValue = mapValue(thisValue, 0, trendHighest, lowest, highest);
        trendLabels.push(data.googleTrend[i].date);
        trendPoints.push({x: moment(data.googleTrend[i].date), y: thisValue});
    }

    var config = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                backgroundColor: 'rgba(255,255,255,0.8)',
                borderColor: 'rgba(255,255,255,0.8)',
                data: trendPoints,
                fill: false,
                radius: 0,
                borderWidth: 1
            },{
                backgroundColor: color,
                borderColor: color,
                data: points,
                fill: true,
                radius: 0
            }]
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
                    type:"time",
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