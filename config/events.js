const moment = require("moment");
const connection = require("./connection.js");
const { startEvent } = require("./startEvent.js");
const { insert , deleteEvent } = require("./database");
const { format } = require("mysql2");
let database = connection.promise();

let now_hour;

async function search_event(page, status) {
  if (status === "start") {
    const [event] = await database.query(
      `SELECT * FROM Eventos WHERE posicao = 'pendente' ORDER BY ABS(TIMESTAMPDIFF(SECOND, date, NOW())) DESC;`
    );
      console.log(event[0])
    event.forEach(async (i) => {
      console.log('evento' ,moment(i.date).format("YYYY-MM-DD HH:mm:ss"))
      if (moment(i.date).subtract(20, 'seconds') < moment()) {
        insert(i, 'DONT');
        deleteEvent(i);
      }
    });
    if (event && event.length > 0) {
      const eventTime = moment(event[0].date).format("YYYY-MM-DD HH:mm:ss");
      const nowHour = moment().add(25, "minutes").format("YYYY-MM-DD HH:mm:ss");

      if (nowHour > eventTime) {
        console.log('preparing_event')
        preparing_event(page, event[0], "start");
      } else {
        console.log('nao encontrei +25m')
        const interval = setInterval(async () => {
          const [evento] = await database.query(
            `SELECT * FROM Eventos WHERE posicao = 'pendente' ORDER BY ABS(TIMESTAMPDIFF(SECOND, date, NOW())) LIMIT 1;`
          );

          if (evento && evento.length > 0) {
            const eventTime = moment(evento[0].date).format("YYYY-MM-DD HH:mm:ss");
            const nowHour = moment().add(25, "minutes").format("YYYY-MM-DD HH:mm:ss");

            if (nowHour > eventTime) {
              preparing_event(page, evento[0], "start");
              clearInterval(interval);
            }else{
            console.log('nao encontrei +25m 01')
            }
          }
        }, 1500000);
      }
    } else {
      console.log('evento nao encontrado')
    }
  }else{
    preparing_event(page, null, "stop");
  }
}

function preparing_event(page, event, argument) {

  if (argument === "start") {

    let preparingtime;
    let startEvents = false;

    const startEventFunction = () => {
      console.log('startEvent')
      startEvent(event, "start", page);
      clearInterval(preparingtime);
    };

    const checkStartEvent = () => {
      const eventTime = moment(event.date).format("YYYY-MM-DD HH:mm:ss");
      now_hour = moment().add(5, "minutes").format("YYYY-MM-DD HH:mm:ss");

      if (now_hour > eventTime && !startEvents) {
        startEventFunction();
      }
    };

    if (event) {
      const eventTime = moment(event.date).format("YYYY-MM-DD HH:mm:ss");
      now_hour = moment().add(5, "minutes").format("YYYY-MM-DD HH:mm:ss");

      if (now_hour > eventTime && !startEvents) {
        startEventFunction();
      } else {
        console.log('nao encontrei +5m 02')
        preparingtime = setInterval(checkStartEvent, 300000);
      }
    }
  } else {
    startEvent(null, "stop", page);
  }
}

exports.search_event = search_event;
