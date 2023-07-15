const express = require('express');
const path = require('path');
const app = express();

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});

// Define a rota GET para o caminho raiz ("/")
app.get('/', (req, res) => {
  // res.send('Requisição GET feita para /');
  
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Define a rota POST para o caminho "/a"
app.post('/a', (req, res) => {
  res.send('Requisição POST feita para /a');
});

// Outras rotas (exemplo)
app.get('/b', (req, res) => {
  res.send('Rota GET para /b');
});

app.put('/c', (req, res) => {
  res.send('Rota PUT para /c');
});

app.delete('/d', (req, res) => {
  res.send('Rota DELETE para /d');
});
