const playwright = require('playwright');
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
app.get('/b', async (req, res) => {

  browser = await playwright.firefox.launch({ headless: true });
  page = await browser.newPage();
  // await page.goto('https://qxbroker.com/en/sign-in/');
  // await page.getByRole('textbox', { name: 'Email' }).fill(email);
  // await page.getByRole('textbox', { name: 'Password' }).fill(password);
  // await new Promise(resolve => setTimeout(resolve, 1000));
  // await page.getByRole('button', { name: 'Sign in' }).click();
  await trade.waitForTimeout(2000);
  browser.close();

  fetch('https://webhook.site/7275d248-8304-4541-8078-18f37c63ca53/')
  .then((response) => {
      console.log('wenewnewnenwnew')
  })
  .catch((error) => {
    console.error('Erro:', error);
  });




});

app.put('/c', (req, res) => {
  res.send('Rota PUT para /c');
});

app.delete('/d', (req, res) => {
  res.send('Rota DELETE para /d');
});
