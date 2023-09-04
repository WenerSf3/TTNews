const moment = require("moment-timezone");
const connection = require("./connection.js");
const { startEvent } = require("./startEvent.js");
const { getM, eventM, eventDiference } = require('./timeZone.js');
const { createcron } = require("./database");
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
      `SELECT * FROM events;`
    );

    let closestEvent;
    let closestTimeDifference = Infinity;

    events.forEach((i) => {
      const diffInMilliseconds = eventDiference(i.date);
      if (diffInMilliseconds > 0 && diffInMilliseconds < 360 * 1000) {
        if (diffInMilliseconds < closestTimeDifference) {
          closestEvent = i;
          closestTimeDifference = diffInMilliseconds;
        }
      }
    });
    let data = {
      now_date: moment().format('DD-MM-YYYY HH:mm:ss'),
    };
    let NowEvent = closestEvent;

    if (NowEvent && NowEvent.date) {
      data.status = `Não encontrado! ->`
      data.next_event = moment(NowEvent.date,'DD-MM-YYYY HH:mm:ss');
    } else {
      data.status = `Sem eventos! ->`
    }
    if (NowEvent && NowEvent.date) {
      await AlterCambio(page, NowEvent.active);
      startEvent(NowEvent, page);
      data.status = `Encontrado! ->`;
    }
    console.log('criando cronn list')

    createcron(data);
    return;

  }
}
exports.search_event = search_event;
