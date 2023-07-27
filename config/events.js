const moment = require('moment');
const connection = require("./connection.js");
const { startEvent } = require("./startEvent.js");
const query = connection.promise();

let next_hour;
let now_hour;

async function search_event(page, status) {
    let interval;
    if(status == 'start'){
        var [event] = await query.execute(
            `SELECT * FROM Eventos WHERE posicao = 'pendente' ORDER BY ABS(TIMESTAMPDIFF(SECOND, date, NOW())) LIMIT 1;`
        );    
        if (event && event.length > 0) {
            const eventTime = moment(event[0].date).format('YYYY-MM-DD HH:mm:ss');
            now_hour = moment().add(25, 'minutes');
            if (now_hour > eventTime) {
                preparing_event(page,event);
            }
            interval = setInterval(async () => {
                var [evento] = await query.execute(
                    `SELECT * FROM Eventos WHERE posicao = 'pendente' ORDER BY ABS(TIMESTAMPDIFF(SECOND, date, NOW())) LIMIT 1;`
                );
                if (event && event.length > 0) {
                    var eventTime = moment(evento[0].date).format('YYYY-MM-DD HH:mm:ss');
                    now_hour = moment().add(25, 'minutes');
                    if (now_hour > eventTime) {
                        preparing_event(page,evento);
                    }
                }
    
            }, 1500000);
        }else{
            clearInterval(interval);
        }
    }
}

function preparing_event(page, event) {

    setInterval(async () => {
        if (event && event.length > 0) {
            var eventTime = moment(event[0].date).format('YYYY-MM-DD HH:mm:ss');
            now_hour = moment().add(5, 'minutes');
            if (now_hour > eventTime) {
                startEvent(page, event);
            }
        }
    }, 300000);
}

exports.search_event = search_event;
