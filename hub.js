const mysql = require('mysql2');
const express = require('express');
const { exec } = require('child_process');
const app = express();

const connection = mysql.createConnection({
    host: 'db4free.net',
    user: 'genosgx',
    password: '12345678',
    database: 'ggxttn',
    port: 3306
});
let database = connection.promise();

require('dotenv').config();
app.use(express.json());

const PORT = 10;
const IP = process.env.IP_HUB || process.env.IP_PRODUCT;

app.listen(PORT, () => {
    console.log(`API rodando em http://${IP}:${PORT}`);
});

app.get('/', (req, res) => {
    res.send('HUB');
});

app.post('/login', async (req, res) => {
    let request = req.body;

    try {
        const [account] = await database.query(
            'SELECT * FROM Users WHERE email = ? AND password = ? AND `key` = ? LIMIT 1',
            [request.email, request.password, request.key]
        );

        exec(`node ./admin.js port=8081`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erro ao executar o comando: ${error.message}`);
                return res.status(500).json({ success: false, message: 'Erro no servidor' });
            }
            console.log(`Comando executado: ${stdout}`);
            return res.status(200).json({ success: true, message: 'Usuário autenticado com sucesso' });
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Erro no servidor' });
    }
});
