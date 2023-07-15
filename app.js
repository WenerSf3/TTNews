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
  let browser;
  try {
    browser = await playwright.firefox.launch({ headless: true });
    const page = await browser.newPage();
    // Resto do seu código para automação com Playwright

    // Exemplo de uma ação com Playwright
    await page.goto('https://qxbroker.com/en/sign-in/');
    // Restante do seu código de automação

    await page.waitForTimeout(2000);
    
    await browser.close();

    // Envie uma resposta de sucesso para indicar que a automação foi concluída
    res.send('Automação concluída com sucesso!');
  } catch (error) {
    console.error('Erro no Playwright:', error);
    // Envie uma resposta de erro informando o problema
    res.status(500).send(`Erro na automação com Playwright: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});



app.put('/c', (req, res) => {
  res.send('Rota PUT para /c');
});

app.delete('/d', (req, res) => {
  res.send('Rota DELETE para /d');
});
