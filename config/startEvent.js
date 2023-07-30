const moment = require("moment");
const { getActive } = require("./actives");
const { insert , deleteEvent } = require("./database");
const connection = require("./connection.js");
const { search_event } = require('./events.js')
let database = connection.promise();


let time;

async function startEvent(evento, argument, web) {
  if (argument == "start") {
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
    let getPrice = false;
    let time = setInterval(async () => {
      horarioMoment = horarioMoment.add(1, "second");
      missing = hourEvent.diff(horarioMoment, "seconds");
      if (missing <= 8 && !getPrice) {
        getPrice = true;
        global.price = await getActive(evento.cambio);


        console.log('opaaaaaaaaa', 'price -->', global.price);
        console.log('parse -->', parseFloat(global.price), 'pips  -->', evento.pavil, (evento.pavil / 100000).toFixed(5))
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

        try {
          await web.click(".deal-list__tab > svg.icon-deal-list-orders");
          web.click(".order__button");
          await web.click(".deal-list__tab > svg.icon-deal-list-trades");
        } catch (error) {
          console.log('nao a nada a clicar')
        }
        insert(evento, 'WIN');
        deleteEvent(evento);

        started = true;
        search_event(web, 'restart');
      }


    }, 1000);
  } else {
    clearInterval(time);
    console.log("Stoped");
  }
}
exports.startEvent = startEvent;
