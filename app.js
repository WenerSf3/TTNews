const playwright = require('playwright');
const mysql = require('mysql2');
const express = require('express');
const path = require('path');
const app = express();

const connection = mysql.createConnection({
  host: 'db4free.net',
  user: 'genosgx',
  password: '12345678',
  database: 'ggxttn',
  port: 3306
});
let database = connection.promise();

app.use(express.json());

let browser;
let page;
let status = false;

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/', (req, res) => {
  res.send({ error: 'OK' });
});

// login
app.post('/login', async (req, res) => {
  const request = req.body;
  
  try {
    const [account] = await database.query(
      'SELECT * FROM Users WHERE email = ? AND password = ? AND `key` = ? LIMIT 1',
      [request.email, request.password, request.key]
    );

    if (account.length !== 0) {
      res.sendFile(path.join(__dirname, 'index.html'));
    } else {
      res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
});

// Outras rotas (exemplo)
app.get('/TTNstart', async (req, res) => {
  browser = await playwright.firefox.launch({ headless: true });
  status = true;

  page = await browser.newPage();
  await page.getByRole('textbox', { name: 'Email' }).fill('tradewener@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('wmgame9898');
  await new Promise(resolve => setTimeout(resolve, 1000));
  await page.getByRole('button', { name: 'Sign in' }).click();

  setTimeout(() => {
    const verify = page.locator("#graph");

    let obg = {
      msg: 'SIM Automação concluída com sucesso!',
      success: true
    }
    let obg2 = {
      msg: 'NAO Automação concluída com sucesso!',
      success: false
    }
    if (verify) {
      res.send(obg);
    } else {
      res.send(obg2);
    }
  }, 3000);
});

app.post('/VerifyCode', async (req, res) => {
  const obj = req.body;

  await page.locator(".input-control-cabinet__input").fill(obj.codigo);
  
  await page.locator(".button.button--primary.button--spaced").click();

  let chamouFuncao = false;
  await page.waitForNavigation({ timeout: 0 });
  let newUrl = page.url();
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  let i = 0;
  const interval = setInterval(async () => {
      i += 1;
    
      if (newUrl != 'https://qxbroker.com/en/sign-in/' && !chamouFuncao) {
          chamouFuncao = true;
          clearInterval(interval);
          res.send('LOGADO!');
      }

      if(i >6){
        res.status(404).json('codigo incorreto');
      }
      
  }, 2000);

});

app.post('/TTNclose', (req, res) => {
  if(status == false){
    res.status(404).json({Ttn:false,message:'TTN está fechado'});
  }
    browser.close();
    status = false;

    res.send('Ttn fechado');
});

app.post('/Call', async (req, res) => {
    if(status == false){
      res.status(404).json({Ttn:false,message:'TTN está fechado'});
    }
    await page.locator(".button.button--success.button--spaced.call-btn.section-deal__button").click();

    res.send('compra executada');

});

app.post('/Put', async (req, res) => {
    if(status == false){
      res.status(404).json({Ttn:false,message:'TTN está fechado'});
    }
    await page.locator(".button.button--danger.button--spaced.put-btn.section-deal__button").click();
    
    res.send('Venda executada');

});

app.post('/AlterCambio', async (req, res) => {
  const obj = req.body;

  if(status == false){
    res.status(404).json({Ttn:false,message:'TTN está fechado'});
  }
  await page.locator(".asset-select__button").click();
  await page.waitForTimeout(1000);
  await page.locator(".asset-select__search-input").fill(String(obj.ativo));
  await page.waitForTimeout(1000);
  await page.locator(".assets-table__name").click();
  
  res.send('Ativo trocado com sucesso!');

});