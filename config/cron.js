const connection = require("./connection.js");
let database = connection.promise();
const axios = require('axios');
require('dotenv').config();

const IP = process.env.IP_LOCAL || process.env.IP_PRODUCT;
const PORT = process.env.PORT;


async function search_eventCron() {
  await axios.get('https://webhook.site/3abc192f-c0a6-40f9-bb3e-3f017251bc2d');
  try {
    const [event] = await database.query(
      `SELECT * FROM Eventos WHERE posicao = 'pendente' ORDER BY ABS(TIMESTAMPDIFF(SECOND, date, NOW())) DESC;`
    );
    const [account] = await database.query(`SELECT * FROM Users LIMIT 1;`);

    if (event.length > 0 && account.search !== '0') {
      let obj = {
        argument: 'start'
      };
      await axios.post(`http://${IP}:${PORT}/preparingEvent`, obj).then((r) => {
        console.log('response -->', r.data);
      });
    }else{
      console.log('Nenhum evento Próximo');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

search_eventCron();
