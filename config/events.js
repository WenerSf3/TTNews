let restam = 0;
let time; // Correção 1: Movemos a declaração da variável 'time' para fora da função para torná-la acessível em ambos os casos.

function startTime(status) {
    if (status === 'start') {
        time = setInterval(() => {
            console.log(`restam: ${restam} para o evento`);
            restam--;
            // Não há necessidade de um setTimeout aqui, pois 'clearConsole' já irá apagar a tela a cada intervalo.
        }, 1000);
    } else {
        clearInterval(time);
    }
}

exports.startTime = startTime;
