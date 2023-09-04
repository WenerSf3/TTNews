const moment = require('moment');

function getM() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
}

function eventM(date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

function eventDiference(date) {
    let data1 = moment();
    let data2 = moment(date, 'YYYY-MM-DD HH:mm:ss');
    let secondsRemaining = data2.diff(data1, 'seconds');

    return secondsRemaining;
}

exports.eventDiference = eventDiference;
exports.getM = getM;
exports.eventM = eventM;
