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
        const targetTime = moment(i.date).subtract(10, 'seconds');

        const diffInMilliseconds = Math.abs(currentTime.diff(targetTime));

        if (diffInMilliseconds < closestDiff) {
          closestDiff = diffInMilliseconds;
          closestEvent = i;
        }
      });

      if (closestEvent) {
        const index = event.indexOf(closestEvent);
        event.splice(index, 1);

        const targetTime = moment(closestEvent.date).subtract(10, 'seconds');
        if (currentTime.isAfter(targetTime)) {
          insert(closestEvent, 'DONT');
          deleteEvent(closestEvent);
        } else {
          eventsPendents.push(closestEvent);
        }
      }
      console.log('Objeto mais próximo:', closestEvent);
      return;
      let NowEvent = eventsPendents.reverse()[0];
      const timeNow = moment().subtract(3, 'hours');
      const timeEvent = moment().subtract(10, 'seconds');
      let content;
      console.log('event', NowEvent);
      content = `Não encontrado! -> ${moment().subtract(3, 'hours').format("YYYY-MM-DD HH:mm")} ,${NowEvent.date}`;

      if (eventsPendents && timeNow.isBefore(timeEvent)) {
        const eventTime = moment(NowEvent.date).format("YYYY-MM-DD HH:mm:ss");
        now_hour = moment().subtract(3, 'hours').add(5, "minutes").add(20, 'seconds').format("YYYY-MM-DD HH:mm:ss");
        if (now_hour > eventTime) {
          AlterCambio(page, NowEvent.cambio);
          startEvent(NowEvent, page);
          content = `Encontrado! -> ${moment().subtract(3, 'hours').format("YYYY-MM-DD HH:mm")}`;
        }
      }
      fs.appendFile('./log.txt', content + '\n', (err) => {
        return;
      });
    }
  }
}
exports.search_event = search_event;
