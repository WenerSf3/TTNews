const connection = require("./connection.js");
var CronJob = require('cron').CronJob;
let database = connection.promise();
const axios = require('axios');
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

            if (event.length > 0 && account.search !== '0') {
                let obj = {
                    argument: 'start'
                };
                try {
                  await axios.post(`http://${IP}:${PORT}1/preparingEvent`, obj).then((a) => {
                });
                } catch (b) {
                  return;
                }
            } else {
                console.log('Nenhum evento Próximo');
            }
            process.exit(0);
        } catch (error) {
            console.error('Error:', error);
            process.exit(1);
        }

    },
    null,
    true,
    'America/Los_Angeles'
);
job.start();

