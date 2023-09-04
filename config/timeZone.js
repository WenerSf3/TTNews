const moment = require('moment');

function getM() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
}

function eventM(date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

function eventDiference(date) {
    let eventTime = moment(date);
    let now = moment();
  console.log(now  , eventTime)

  
    if (eventTime.isBefore(now)) {
      return 0;
    }
  
    let secondsRemaining = eventTime.diff(now, 'seconds');
  console.log(secondsRemaining)
    return secondsRemaining;
}
  

exports.eventDiference = eventDiference;
exports.getM = getM;
exports.eventM = eventM;
