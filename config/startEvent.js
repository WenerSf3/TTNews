const { getActive } = require("./actives");
const { insert, deleteEvent } = require("./database");
const moment = require("moment");
const axios = require('axios');

async function startEvent(evento, web, banca = null) {
  hourEvent = moment(
    evento.date,
    "YYYY-MM-DD HH:mm:ss"
  ) /*.subtract(11 , "seconds")*/;
  const horarioData = await web.$eval(".server-time.online", (element) =>
    element.textContent.trim()
  );
  const horarioRegex = /(\d{2}:\d{2}:\d{2})/;
  const match = horarioData.match(horarioRegex);
  const horario = match ? match[1] : null;

  let horarioMoment = moment(
    `${moment().format("YYYY-MM-DD")} ${horario}`,
    "YYYY-MM-DD HH:mm:ss"
  );

  let missing = 0;
  let started = false;
  let time = setInterval(async () => {
    horarioMoment = horarioMoment.add(1, "second");
    missing = hourEvent.diff(horarioMoment, "seconds");
    if (missing <= 28 && !started) {
      started = true;
      global.price = await getActive(evento.active);
      clearInterval(time);
      let self = (parseFloat(global.price) - (evento.pips / 100000)).toFixed(5);
      let buy = (parseFloat(global.price) + (evento.pips / 100000)).toFixed(5);

      await web.locator(".section-deal__pending").click();
      await web.locator(".form-pending-trade__input-text").fill(String(buy));
      await web.click(".form-pending-trade__button.green");
      await web.waitForTimeout(500);
      await web.locator(".form-pending-trade__input-text").fill(String(self));
      await web.click(".form-pending-trade__button.red");

      await web.click("#graph");

      setTimeout(async () => {
        resetSteps(web);
        const accountmoney = await page.locator(".usermenu__info-balance");
        const afterbanca = await accountmoney.innerText();
        var after = afterbanca.replace(/£/g, '');
        if (banca) {
          if (parseInt(after) > banca) {
            insert(evento, `WIN = ${after}`);
          } else if (parseInt(after) < banca) {
            insert(evento, `LOSS = ${after}`);
          } else {
            insert(evento, `SEM STATUS ${after}`);
          }
        } else {
          insert(evento, `SEM STATUS ${after}`);
        }
      }, 15000);
      deleteEvent(evento);

      console.log('Evento Concluido!!');

    } else {
      console.clear()
      console.log('Aguardando horario!');
    }
  }, 1000);
  console.clear()
}
async function resetSteps() {
  try {
    await axios.post(`http://154.56.41.121:81/closePendent`);
    await axios.post(`http://154.56.41.121:81/closePendent`);
  } catch (error) {
    return;
  }
  return;
}

exports.startEvent = startEvent;
