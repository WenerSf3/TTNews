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


module.exports = connection;