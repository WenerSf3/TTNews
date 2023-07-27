const mysql = require('mysql2');

// Configuração da conexão
const connection = mysql.createConnection({
    host: '154.56.41.121',
    user: 'ttnuser',
    password: 'wmgame9898',
    database: 'ttnbasee',
    port: 3306
});

// Estabelece a conexão
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }

    console.log('Conexão estabelecida com sucesso!');
    console.log('Digite comandos SQL para serem executados no banco de dados. Digite "sair" para sair.');

    // Cria um console interativo para digitar comandos SQL
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Função para executar o comando SQL e exibir o resultado
    function executarComandoSQL(comando) {
        connection.query(comando, (err, result) => {
            if (err) {
                console.error('Erro ao executar o comando:', err);
            } else {
                console.log('Resultado:');
                console.log(result);
            }

            rl.prompt();
        });
    }

    // Aguarda o usuário digitar um comando SQL
    rl.prompt();

    rl.on('line', (input) => {
        if (input.trim().toLowerCase() === 'sair') {
            console.log('Desconectando do banco de dados...');
            // Fecha a conexão antes de sair
            connection.end(() => {
                console.log('Conexão encerrada. Adeus!');
                process.exit(0);
            });
        } else {
            // Executa o comando SQL digitado pelo usuário
            executarComandoSQL(input);
        }
    }).on('close', () => {
        console.log('Desconectando do banco de dados...');
        // Fecha a conexão antes de sair
        connection.end(() => {
            console.log('Conexão encerrada. Adeus!');
            process.exit(0);
        });
    });
});
