const moment = require("moment");
const connection = require("./connection.js");
let database = connection.promise();

setTimeout(async () => {
    let closestEvent = null;
    let closestDiff = Infinity;

    const [events] = await database.query(
        `SELECT * FROM Eventos;`
        // `SELECT * FROM Eventos WHERE posicao = 'pendente' AND STR_TO_DATE(date, '%Y-%m-%d %H:%i:%s') >= NOW() ORDER BY STR_TO_DATE(date, '%Y-%m-%d %H:%i:%s');`
    );

    const currentTime = moment();
    console.log("Event:", events);

    events.forEach((i) => {
        const targetTime = moment(i.date, 'YYYY-MM-DD HH:mm:ss');
        const diffInMilliseconds = targetTime.diff(currentTime);

        if (diffInMilliseconds > 0 && diffInMilliseconds < closestDiff) {
            closestDiff = diffInMilliseconds;
            closestEvent = i;
        }
    });

    console.log("Closest Event:", closestEvent);
    return;

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

    console.log('evento', event)
}, 1);