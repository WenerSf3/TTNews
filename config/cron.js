const connection = require("./connection.js");
let database = connection.promise();
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

// const IP = process.env.IP_LOCAL || process.env.IP_PRODUCT;
// const PORT = process.env.PORT;



function teste() {
const conteudo = 'Ok';
const caminhoArquivo = './cronfig/';

fs.writeFile(caminhoArquivo, conteudo, (err) => {
    if (err) {
      console.error('Erro ao criar o arquivo ou escrever nele:', err);
    } else {
      console.log('Arquivo criado e conteúdo escrito com sucesso!');
    }
  });
}

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
teste();
// search_eventCron();
