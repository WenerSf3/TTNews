const mysql = require('mysql2');

// Configuração da conexão
const connection = mysql.createConnection({
    host: 'db4free.net',
    user: 'genosgx',
    password: '12345678',
    database: 'ggxttn',
    port: 3306
});


module.exports = connection;
