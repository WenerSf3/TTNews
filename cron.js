const CronJob = require('cron').CronJob;
const axios = require('axios');
const connection = require("./config/connection");
const { createcron } = require("./config/database");
const fs = require('fs');
const dotenv = require('dotenv');
const moment = require('moment');

let database = connection.promise();

if (fs.existsSync('./dev.v')) {
    dotenv.config({ path: '.env.development' });
} else {
    dotenv.config();
}

const IP = process.env.IP;
const PORT = process.env.PORT;

const job = new CronJob(
    '*/5 * * * *',
    async function main() {
        try {
            console.clear();
            const [account] = await database.query(`SELECT * FROM users LIMIT 1;`);
            console.log('executado');

            const [events] = await database.query(`SELECT * FROM events WHERE date > ? AND date < ? AND status = ?;`,[
                moment().format('YYYY-MM-DD HH:mm:ss'),
                moment().add(10, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
                'pendente'
            ]);

            console.log('events', events);

            if (events.length >= 1 && account[0].search !== 0) {
                const obj = {
                    argument: 'start'
                };
                await axios.post(`http://${IP}:${PORT}/preparingEvent`, obj);
                await axios.post(`http://${IP}:${PORT}/antiLogout`, obj);
            } else {
                let data = {
                    next_event: `Busca`,
                    now_date: `permision : ${account[0].search !== 0}`,
                    status: ` nao habilitado`
                }
                createcron(data);
            }
        } catch (error) {
            console.clear();
            console.log('deslogado');
        }
    },
    null,
    true,
    'America/Los_Angeles'
);

job.start();
