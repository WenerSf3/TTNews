const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000; // Porta na qual o servidor será executado

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});

app.get('/', (req, res) => {
console.log(__dirname, 'index.html')
setTimeout(() => {
  res.sendFile(path.join(__dirname, 'index.html'));
}, 10000);
});
