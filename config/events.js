const moment = require("moment");
const connection = require("./connection.js");
const { startEvent } = require("./startEvent.js");
const { insert, deleteEvent } = require("./database");
const fs = require('fs');
let database = connection.promise();

let now_hour;
let event;

async function getdbEvents() {
  const [event] = await database.query(
    `SELECT * FROM Eventos WHERE posicao = 'pendente' ORDER BY ABS(TIMESTAMPDIFF(SECOND, date, NOW())) DESC;`
  );
  return event;
}
async function AlterCambio(page, ativo) {
  try {
    await page.click(".asset-select__button", { timeout: 1000 });
  } catch (e) {
  }

  await page.waitForTimeout(500);

  try {
    await page.locator(".asset-select__search-input", { timeout: 1000 }).fill(String(ativo));
  } catch (e) {
  }

  await page.waitForTimeout(500);

  try {
    await page.click(".assets-table__name", { timeout: 1000 });
  } catch (e) {
  }
}
async function search_event(page, argument) {
  if (argument === "start") {
    event = await getdbEvents();
    let eventsPendents = [];
    let closestEvent = null;
    let closestDiff = Infinity;

    if (event.length !== 0) {
      const currentTime = moment().subtract(3, 'hours');

      event.forEach((i) => {
        const targetTime = moment(i.date).add(30, 'seconds');
    
        const diffInMilliseconds = Math.abs(currentTime.diff(targetTime));
    
        if (diffInMilliseconds < closestDiff) {
            closestDiff = diffInMilliseconds;
            closestEvent = i;
        }
    });
    
    if (closestEvent) {
        const index = event.indexOf(closestEvent);
        event.splice(index, 1);
    
        const targetTime = moment(closestEvent.date).add(4, 'minutes'); 
        if (currentTime > targetTime) {
            setTimeout(() => {
                insert(closestEvent, 'DONT');
                deleteEvent(closestEvent);
            }, 5000);
        } else {
            eventsPendents.push(closestEvent);
        }
    }
      let NowEvent = closestEvent;
      const timeNow = moment().subtract(3,'hours');
      const timeEvent = moment(NowEvent.date).subtract(10, 'seconds');
      let content;

      content = `Não encontrado! -> ${timeNow.format("YYYY-MM-DD HH:mm")} , Proximo Evento! -> ${moment(NowEvent.date).format("YYYY-MM-DD HH:mm")},`;
      console.log('time' , timeNow < timeEvent, timeNow , timeEvent)
      if (NowEvent && timeNow < timeEvent) {
        eventTime = moment(NowEvent.date).format("YYYY-MM-DD HH:mm:ss");

        now_hour = moment(timeNow).add(5, "minutes").add(20, 'seconds').format("YYYY-MM-DD HH:mm:ss");
        console.log('now_hour' , now_hour > eventTime , now_hour , eventTime)
        if (now_hour > eventTime) {
          startEvent(NowEvent, page);
          content = `Encontrado! -> ${moment().subtract(3, 'hours').format("YYYY-MM-DD HH:mm")},Evento! -> ${moment(NowEvent.date).format("YYYY-MM-DD HH:mm")},`;
        }
      }
      fs.appendFile('./log.csv', content + '\n', (err) => {
        return;
      });
    }
  }
}
exports.search_event = search_event;
