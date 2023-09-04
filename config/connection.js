const mysql = require('mysql2');

// Configuração da conexão
const connection = mysql.createConnection({
    host: '154.56.41.121',
    user: 'wener',
    password: '@123Mudar!',
    database: 'ttnBot',
    port: 3306
});


module.exports = connection;
