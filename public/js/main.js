var socket = io();
$(function () {
    // var socket = io();
    socket.on('bitcoinPrice', function(bitcoinPrice){
        $('.bitcoin-price').html(formatNumber(bitcoinPrice));
    });
    socket.on('poloPrices', function(price){
        $('.etherium-price').html(parseFloat(price.ETH).toFixed(5));
        $('.bitcoin-price-box.etherium').attr('data-price', parseFloat(price.ETH).toFixed(5)*100000);

        $('.etheriumClassic-price').html(parseFloat(price.ETC).toFixed(5));
        $('.bitcoin-price-box.etheriumClassic').attr('data-price', parseFloat(price.ETC).toFixed(5)*100000);

        $('.zcash-price').html(parseFloat(price.ZEC).toFixed(5));
        $('.bitcoin-price-box.zcash').attr('data-price', parseFloat(price.ZEC).toFixed(5)*100000);

        $('.dash-price').html(parseFloat(price.DASH).toFixed(5));
        $('.bitcoin-price-box.dash').attr('data-price', parseFloat(price.DASH).toFixed(5)*100000);

        $('.monero-price').html(parseFloat(price.XMR).toFixed(5));
        $('.bitcoin-price-box.monero').attr('data-price', parseFloat(price.XMR).toFixed(5)*100000);

        // sort them sortDivs
        sortDivs();
    });
    socket.on('reload', function(data){
        location.reload();
    });
    heightFix();
});

function formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var bitcoinPrice = 0;


function sortDivs(){
    // tinysort(child_nodes,{attr:'data-price'});
    $('div#sortable>.bitcoin-price-box').tsort({attr:'data-price', order:'desc'});
    // console.log($('.sortable').children('.bitcoin-price-box'));
}


function heightFix() {
    var n = $('.bitcoin-price-box').length;
    console.log('There are '+ n + ' divs');
    var heights = $( window ).height() / n;
    $('.bitcoin-price-box').height(heights);
    $('.bitcoin-price-box .title').css({
        lineHeight:heights+'px'
    });
    $('.bitcoin-price-box').css({
        lineHeight:heights+'px'
    });
    $('.bitcoin-price-box .price').css({
        lineHeight:heights+'px',
        fontSize:heights < 110 ? (heights*.9)+'px' : '110px'
    });
}