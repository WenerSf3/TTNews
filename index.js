const express = require('express');
const app = express();

const PORT = 3000; // Porta na qual o servidor será executado

app.get('/', (req, res) => {
  res.send('Olá, mundo!'); // Exemplo de resposta do servidor
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});