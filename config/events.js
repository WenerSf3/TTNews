const moment = require("moment");
const connection = require("./connection.js");
const { startEvent } = require("./startEvent.js");
const { insert, deleteEvent } = require("./database");
const axios = require('axios');
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
        if (moment() > moment(i.date).subtract(20, 'seconds')) {
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
        let obj = {
          ativo: event_.cambio,
        };
        await axios.post(`http://154.56.41.121:81/AlterCambio`, obj);
        startEvent(event_, page);
      } else {
        return console.log('evento nao encontrado por perto!');
      }
    }
  }
}

exports.search_event = search_event;
