const moment = require('moment');

function getM() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
}

function eventM(date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

function eventDiference(date) {
    let data1 = moment().format('YYYY-MM-DD HH:mm:ss');
    let data2 = moment(date, 'YYYY-MM-DD HH:mm:ss');
    console.log('data', data1)
    console.log('data2', data2)
    let secondsRemaining = data1.diff(data2);

    console.log('diferença', secondsRemaining)
    return secondsRemaining;
}


exports.eventDiference = eventDiference;
exports.getM = getM;
exports.eventM = eventM;
