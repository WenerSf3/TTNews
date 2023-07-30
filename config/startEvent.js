const moment = require("moment");
const { getActive } = require("./actives");
const { insert , deleteEvent } = require("./database");
const connection = require("./connection.js");
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

      }


    }, 1000);
  } else {
    clearInterval(time);
    console.log("Stoped");
  }
}
// async function AllReady(estrategia, id, pips, ativo, trade) {
//   // console.log('caiu auqi :', preco_atual)

//   await trade.waitForTimeout(1500);
//   if (estrategia == "doubleguard") {
//     let retracao = null;
//     switch (ativo) {
//       case "EURUSD":
//         retracao = 0.00001 * pips;
//         break;
//       case "GBPUSD":
//         retracao = 0.00001 * pips;
//         break;
//     }
//     let formatbuy = parseFloat(preco_atual) + retracao;
//     let buy = formatbuy.toFixed(5);

//     let formatself = parseFloat(preco_atual) - retracao;
//     let self = formatself.toFixed(5);

//     // console.log('este é o preço buy:', buy)
//     // console.log('este é o preço self:', self)



//     trade.waitForTimeout(1000);
//     trade.click(".order__button");
//     trade.waitForTimeout(2000);
//     await query.query(`DELETE FROM Eventos WHERE id = ${id}`);
//     await trade.click(".deal-list__tab > svg.icon-deal-list-trades");
//     logado(trade);
//     // await query.query(`INSERT INTO eventos_passados (id, name_event, pegou, resultado) VALUES (${event}, 'teste', 'sim', 'teste')"`);
//   }
// }
exports.startEvent = startEvent;
