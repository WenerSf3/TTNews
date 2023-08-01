const { getActive } = require("./actives");
const { insert, deleteEvent } = require("./database");
const moment = require("moment");

async function startEvent(evento, web) {
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
    if (missing <= 9 && !started) {
      started = true;
      global.price = await getActive(evento.cambio);
      clearInterval(time);
      let self = (parseFloat(global.price) - (evento.pavil / 100000)).toFixed(5);
      let buy = (parseFloat(global.price) + (evento.pavil / 100000)).toFixed(5);

      await web.locator(".section-deal__pending").click();
      await web.locator(".form-pending-trade__input-text").fill(String(buy));
      await web.click(".form-pending-trade__button.green");
      await web.waitForTimeout(500);
      await web.locator(".form-pending-trade__input-text").fill(String(self));
      await web.click(".form-pending-trade__button.red");

      await web.click("#graph");

      setTimeout(() => {
        resetSteps(web);
      }, 11000);
      insert(evento, 'WIN');
      deleteEvent(evento);
    } else {
      console.clear()
      console.log('Aguardando horario!');
    }
  }, 1000);
  console.clear()
  console.log('Evento Concluido!!');
}
async function resetSteps(web) {
  await web.click(".deal-list__tab > svg.icon-deal-list-orders");
  await trade.waitForTimeout(500);
  try {
    web.click(".order__button");
  } catch (error) {
    console.log('nao a nada a clicar')
  }
  try {
    await web.click(".order__button");
  } catch (error) {
    console.clear();
  }
  await web.click(".deal-list__tab > svg.icon-deal-list-trades");
}

exports.startEvent = startEvent;