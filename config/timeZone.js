const moment = require('moment');

function getM() {
    return moment().subtract(3, 'hours').format('YYYY-MM-DD HH:mm:ss');
}
function eventM(date) {
    return moment(date).subtract(3, 'hours').format('YYYY-MM-DD HH:mm:ss');
}

exports.getM = getM;
exports.eventM  = eventM;
