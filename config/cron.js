const connection = require("./connection.js");
const CronJob = require('cron').CronJob;
const axios = require('axios');
require('dotenv').config();

const IP = process.env.IP_LOCAL || process.env.IP_PRODUCT;
const PORT = process.env.PORT;

const database = connection.promise();

const job = new CronJob(
    '*/5 * * * *',
    async function () {
        axios.get('https://webhook.site/3abc192f-c0a6-40f9-bb3e-3f017251bc2d');
        try {
            const [event] = await database.query(
                `SELECT * FROM Eventos WHERE posicao = 'pendente' ORDER BY ABS(TIMESTAMPDIFF(SECOND, date, NOW())) DESC;`
            );
            const [account] = await database.query(`SELECT * FROM Users LIMIT 1;`);

            if (event.length > 0 && account.search !== '0') {
                let obj = {
                    argument: 'start'
                };
                try {
                    await axios.post(`http://${IP}:${PORT}/preparingEvent`, obj);
                } catch (error) {
                    return;
                }
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
