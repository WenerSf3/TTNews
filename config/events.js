const moment = require("moment");
const connection = require("./connection.js");
const { startEvent } = require("./startEvent.js");
const { getM  , eventM } = require('./timeZone.js')
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

    const currentTime = getM();

    let closestEvent;
    events.forEach((i) => {
      const targetTime = eventM(i.date);
      const diffInMilliseconds = targetTime.diff(currentTime) / 1000;

      if (diffInMilliseconds > 0 && diffInMilliseconds < 360) {
        closestEvent = i;
      }
    });
    let NowEvent = closestEvent;
    const timeNow = getM();
    let content =  `Não encontrado! -> ${timeNow} ${eventM(NowEvent.date)}`;
    if (NowEvent && NowEvent.date) {
      await AlterCambio(page,NowEvent.cambio);

      const timeEvent = eventM(NowEvent.date).subtract(10, 'seconds');
      
      if (NowEvent && timeNow < timeEvent) {
        let eventTime = eventM(NowEvent.date);

        now_hour = eventM(timeNow).add(10, 'minutes');
        if (now_hour > eventTime) {
          startEvent(NowEvent, page);
          content = `Encontrado! -> ${getM()}, Evento! -> ${eventM(NowEvent.date)},`;
        }
      }
    }
    fs.appendFile('./log.csv', content + '\n', (err) => {
      return;
    });

  }
}
exports.search_event = search_event;
