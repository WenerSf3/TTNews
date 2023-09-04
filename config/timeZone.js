const moment = require('moment');

function getM() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
}

function eventM(date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

function eventDiference(date) {
    let timenow = moment();
    let eventTime = moment(date);
    console.log('test 1' ,timenow ,'evento', eventTime )
    let diference = (timenow.diff(eventTime) / 1000).toFixed(0);
    console.log(diference )
    return diference;
}

exports.eventDiference = eventDiference;
exports.getM = getM;
exports.eventM = eventM;
