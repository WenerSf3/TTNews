var CronJob = require('cron').CronJob;
const axios = require('axios');
const connection = require("./config/connection");
let database = connection.promise();
require('dotenv').config();

const IP = process.env.IP_LOCAL || process.env.IP_PRODUCT;
const PORT = process.env.PORT;

var job = new CronJob(
    '*/5 * * * *',
    async function () {
        try {
            const [event] = await database.query(
                `SELECT * FROM Eventos WHERE posicao = 'pendente' ORDER BY ABS(TIMESTAMPDIFF(SECOND, date, NOW())) DESC;`
            );
            const [account] = await database.query(`SELECT * FROM Users LIMIT 1;`);
            if (event.length > 0 && account[0].search !== '0') {
                let obj = {
                    argument: 'start'
                };
                await axios.post(`http://${IP}:${PORT}/preparingEvent`, obj);
                await axios.post(`http://${IP}:${PORT}/antiLogout`, obj);
            } else {
                console.log('Desabilitado');
            }
            process.exit(0);
        } catch (a) {
            console.log('erro')
            process.exit(1);
        }
    },
    null,
    true,
    'America/Los_Angeles'
);
job.start();