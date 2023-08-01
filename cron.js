var CronJob = require('cron').CronJob;
const axios = require('axios');
const connection = require("./config/connection");
let database = connection.promise();
require('dotenv').config();

const IP = process.env.IP_LOCAL || process.env.IP_PRODUCT;
const PORT = process.env.PORT;

var job = new CronJob(
    '* * * * * *',
    async function () {
        await axios.get('https://webhook.site/3abc192f-c0a6-40f9-bb3e-3f017251bc2d');
        try {
            const [event] = await database.query(
                `SELECT * FROM Eventos WHERE posicao = 'pendente' ORDER BY ABS(TIMESTAMPDIFF(SECOND, date, NOW())) DESC;`
            );
            const [account] = await database.query(`SELECT * FROM Users LIMIT 1;`);
                console.log(`http://${IP}:${PORT}/preparingEvent`)
            if (event.length > 0 && account.search !== '0') {
                let obj = {
                    argument: 'start'
                };
                const test = await axios.post(`http://${IP}:${PORT}/preparingEvent`, obj);
                console.log(test);


            } else {
                console.log('Nenhum evento Próximo');
            }
            process.exit(0);
        } catch (a) {
            process.exit(1);
        }
    },
    null,
    true,
    'America/Los_Angeles'
);
job.start();