var socket = io();
$(function () {
    // var socket = io();
    socket.on('bitcoinPrice', function(bitcoinPrice){
        $('.bitcoin-price').html(formatNumber(bitcoinPrice));
        $('.price-sub').html(moment().format('MMMM Do YYYY, h:mm a'));
    });
    socket.on('bitcoinHistorical', function(bitcoinHistorical){
        var newData = [];
        for (var date in bitcoinHistorical) {
            var item = {
                x: date,
                y: bitcoinHistorical[date].toFixed(2)
            };
            newData.push(item);
        }
        //update chart
        // console.log(newData);
        bitcoinChart.data.datasets[0].data = newData;
        bitcoinChart.update();
        bitcoinChart.resize();
    });
    socket.on('reload', function(data){
        location.reload();
    });
});

function formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var bitcoinPrice = 0;

// setup chart.js

var ctx = document.getElementById("bitcoin-chart");


Chart.defaults.global.animation = {
    duration: 0
};
Chart.defaults.global.legend = {
    display: false
};
Chart.defaults.global.maintainAspectRatio = false;

var bitcoinChart = new Chart(ctx, {
    type: 'line',
    backgroundColor: 'rgba(255,255,255,0.3)',
    data: {
        datasets: [{
            label: 'BTC/USD',
            lineTension: 0,
            data: [],
            backgroundColor: 'rgba(237,160,73,0.6)',
            borderColor: 'rgba(237,160,73,1)',
            pointRadius: 0,
        }]
    },
    options: {
        animation: false,
        tooltips: {
            backgroundColor: 'rgba(77,77,77,1)',
            enabled: true,
            mode: 'nearest',
            intersect: false,
            titleFontFamily: 'Ubuntu',
            bodyFontFamily: 'Ubuntu',
            displayColors: false,
            bodyFontColor: '#ccc',
            titleFontColor: '#eda049',
            xPadding: 20,
            caretSize: 10,
            callbacks: {
                // tooltipItem is an object containing some information about the item that this label is for (item that will show in tooltip).
                // data : the chart data item containing all of the datasets
                label: function (tooltipItem, data) {
                    console.log('Label-tooltipItem', tooltipItem);
                    console.log('Label-data', data);
                    return moment(tooltipItem.xLabel).format('MMM Do, YYYY');
                    // Return string from this function. You know the datasetIndex and the data index from the tooltip item. You could compute the percentage here and attach it to the string.
                },
                title:function (tooltipItem, data) {
                    console.log('Title-tooltipItem', tooltipItem);
                    console.log('Title-data', data);
                    return '$'+formatNumber(parseFloat(tooltipItem[0].yLabel).toFixed(2));

                    // Return string from this function. You know the datasetIndex and the data index from the tooltip item. You could compute the percentage here and attach it to the string.
                }
            }
        },
        scales: {
            yAxes: [{
                display: false
            }],
            xAxes: [{
                type: 'time',
                position: 'bottom',
                time: {
                    displayFormats: {
                        quarter: 'MMM YYYY'
                    }
                },
                display: false
            }]
        }
    }
});