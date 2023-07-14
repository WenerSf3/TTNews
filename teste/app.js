const mysql = require('mysql2');
const Express = require('express');
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('America/Sao_Paulo');
// Configurações de conexão com o banco de dados
const connection = mysql.createConnection({
    host: 'containers-us-west-190.railway.app',    // Endereço do banco de dados
    user: 'root',   // Usuário do banco de dados
    password: 'dnHTQ2dsvgwwzJHosUAy', // Senha do banco de dados
    database: 'railway',  // Nome do banco de dados
    port: 6622
});

connection.connect((err) =>{
    if(err){
        console.log('db connection error', err);
    }
    else{
        console.log('Conectado')
    }
})

const app = new Express();
app.use(Express.json());

app.listen(8000);

app.post('/salva-evento', async (req, res) => {
    var data = await req.body;
    await connection.promise().query(`
    INSERT INTO eventos (evento, nivel, date, pavil, confia, ativo, created_at, updated_at)
    VALUES ('${data.evento}', ${data.nivel}, '${data.date}', 0, 0, 'true', '${moment().format()}', '${moment().format()}')
  `);
  
    return res.json({ message: 'Evento criado com sucesso!' });
});

