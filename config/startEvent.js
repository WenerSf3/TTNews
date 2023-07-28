const moment = require("moment");
const { getActive } = require("./actives");

let time;

async function startEvent(evento, argument, web) {
  if (argument == "start") {
    hourEvent = moment(evento.date,'YYYY-MM-DD HH:mm:ss').subtract(11 , "seconds");
    const horarioData = await web.$eval(".server-time.online", (element) =>
      element.textContent.trim()
      );
    const horarioRegex = /(\d{2}:\d{2}:\d{2})/;
    const match = horarioData.match(horarioRegex);
    const horario = match ? match[1] : null;

    const horarioMoment = moment(
      `${moment().format("YYYY-MM-DD")} ${horario}`,
      "YYYY-MM-DD HH:mm:ss"
    );
    let missing = 0;
    let started = false;
    let getPrice = false;
    let time = setInterval(() => {
      horarioMoment = horarioMoment.add(1, "second");
      missing = hourEvent.diff(horarioMoment, "seconds");
      if (missing <= 25 && !getPrice) {
        getActive();
        getPrice = true;
      }

      if (missing <= 3 && !started) {
        started = true;

        clearInterval(time);
      }
      console.log("faltam -->", missing);
    }, 1000);
  } else {
    clearInterval(time);
    console.log("Stoped");
  }
}
exports.startEvent = startEvent;
