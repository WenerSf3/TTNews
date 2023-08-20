const moment = require("moment");
const connection = require("./connection.js");
const { startEvent } = require("./startEvent.js");
const fs = require('fs');
let database = connection.promise();
let now_hour;

async function AlterCambio(page, ativo) {
  try {
    await page.click(".asset-select__button", { timeout: 1000 });
    await page.waitForTimeout(500);
  } catch (e) {
  }


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

    const [events] = await database.query(
      `SELECT * FROM Eventos;`
    );

    const currentTime = moment().subtract(3, 'hours');


    let closestEvent;
    events.forEach((i) => {
      const targetTime = moment(i.date, 'YYYY-MM-DD HH:mm:ss').subtract(3, 'hours');
      const diffInMilliseconds = targetTime.diff(currentTime) / 1000;

      if (diffInMilliseconds > 0 && diffInMilliseconds < 360) {
        closestEvent = i;
      }
    });
    let NowEvent = closestEvent;
    const timeNow = moment().subtract(3, 'hours');
    let content =  `Não encontrado! -> ${timeNow.format("YYYY-MM-DD HH:mm")} `;
    if (NowEvent && NowEvent.date) {
      await AlterCambio(page,NowEvent.cambio);

      const timeEvent = moment(NowEvent.date).subtract(10, 'seconds');
      
      if (NowEvent && timeNow < timeEvent) {
        eventTime = moment(NowEvent.date).format("YYYY-MM-DD HH:mm:ss");

        now_hour = moment(timeNow).add(3, 'hours').add(10, 'minutes').format("YYYY-MM-DD HH:mm:ss");
        if (now_hour > eventTime) {
          startEvent(NowEvent, page);
          content = `Encontrado! -> ${moment().subtract(3, 'hours').format("YYYY-MM-DD HH:mm")}, Evento! -> ${moment(NowEvent.date).format("YYYY-MM-DD HH:mm")},`;
        }
      }
    }
    fs.appendFile('./log.csv', content + '\n', (err) => {
      return;
    });

  }
}
exports.search_event = search_event;
