const moment = require('moment');

function getM() {
    return moment().subtract(3, 'hours').format('YYYY-MM-DD HH:mm:ss');
}

function eventM(date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

function eventDiference(date) {
    let timenow = moment().subtract(3, 'hours');
    console.log(timenow)
    let eventTime = moment(date);
    let diference = ((timenow.diff(eventTime) / 1000) * -1).toFixed(0);
    return diference;
}

exports.eventDiference = eventDiference;
exports.getM = getM;
exports.eventM = eventM;
