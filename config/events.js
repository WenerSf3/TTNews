const moment = require("moment");
const connection = require("./connection.js");
const { startEvent } = require("./startEvent.js");
const { insert, deleteEvent } = require("./database");
let database = connection.promise();

let now_hour;
let buscaInterval;
let event;
let evento;

async function getdbEvents() {
  const [event] = await database.query(
    `SELECT * FROM Eventos WHERE posicao = 'pendente' ORDER BY ABS(TIMESTAMPDIFF(SECOND, date, NOW())) DESC;`
  );
  return event;
}

async function search_event(page, argument) {
  if (argument === "start") {
    event = await getdbEvents();

    if (event.length != 0) {
      event.forEach(async (i) => {
        console.log('evento', moment(i.date).format("YYYY-MM-DD HH:mm:ss"))
        if (moment(i.date).subtract(20, 'seconds') < moment()) {
          insert(i, 'DONT');
          deleteEvent(i);
        }
      });
    }

    let event_ = event[0];

    if (event_) {
      const eventTime = moment(event_.date).format("YYYY-MM-DD HH:mm:ss");
      now_hour = moment().add(5, "minutes").format("YYYY-MM-DD HH:mm:ss");

      if (now_hour > eventTime) {
        startEvent(event_, page);
      } else {
        return;
      }
    }
  }
}

exports.search_event = search_event;
