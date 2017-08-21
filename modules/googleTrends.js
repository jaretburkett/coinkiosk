const googleTrends = require('google-trends-api');
const moment = require('moment');
const coins = require('../config/coins.json');

let searchArr = [];
let returnData = {};

// only allows 5 at a time
function trendSection(pos, callback){
    // set options
    let startTime = new Date();
    startTime.setDate(startTime.getDate() - 1); // 1 day
    let opt = {
        keyword:searchArr[pos],
        startTime:startTime,
        endTime: new Date(Date.now())
    };
    // console.log(opt);
    googleTrends.interestOverTime(opt, function(err, results){
        try{
            results = JSON.parse(results);
            if(pos === 0){
                returnData = results.default.timelineData;
            } else {
                let timelineData = results.default.timelineData;
                for(let i = 0; i < timelineData.length; i++){
                    try{
                        returnData[i].value.push(timelineData[i].value[0])
                        returnData[i].formattedValue.push(timelineData[i].formattedValue[0])
                    }catch(e){
                        console.log('trendError:', e);
                    }
                }
            }
            if(pos + 1 < searchArr.length){
                // run again
                trendSection(pos+1, callback);
            } else {
                // done, return
                callback(false, returnData);
            }
        }catch(e){
            callback({error:e, data:results}, null);
        }
    });
}



const getTrends = (callback) =>{
    // clear data
    searchArr = [];
    returnData = {};
    for(let key in coins){
        searchArr.push(coins[key].seatchTerm);
    }
    trendSection(0,callback);
};




function test(){
    getTrends((err, data)=>{
        if(err){
            console.log('Error: ',err);
        } else {
            console.log(data);
        }
    });
}

if (require.main === module) {
    test();
}

module.exports.getTrends = getTrends;