const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000; // Porta na qual o servidor será executado

app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
  });

app.get('/', (req, res) => {
  res.json({ title: "API em Node;js"}); // Exemplo de resposta do servidor
});

