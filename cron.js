const CronJob = require('cron').CronJob;
const axios = require('axios');
const connection = require("./config/connection");
const { createcron } = require("./config/database");
const fs = require('fs');
const dotenv = require('dotenv');

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
    async function () {

        const [account] = await database.query(`SELECT * FROM users LIMIT 1;`);
        console.log('executado');
        if (account[0].search !== 0) {
            const obj = {
                argument: 'start'
            };
            console.log('encontrado' , account[0].search);
            await axios.post(`http://${IP}:${PORT}/preparingEvent`, obj);
            await axios.post(`http://${IP}:${PORT}/antiLogout`, obj);
        } else {
            let data = {
                next_event: `Busca`,
                now_date: `permision : ${account[0].search !== 0}`,
                status: ` nao habilitado`
            }
            console.log('erro' , account[0].search);
            createcron(data);
        }
    },
    null,
    true,
    'America/Los_Angeles'
);

job.start();
