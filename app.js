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
require('dotenv').config();

let database = connection.promise();

app.use(express.json());

let browser;
let page;
let status = false;

const PORT = process.env.PORT;
const IP = process.env.IP_LOCAL || process.env.IP_PRODUCT;

app.listen(PORT, () => {
  console.log(`API rodando em http://${IP}:${PORT}`);
});


app.use((req, res, next) => {
  const allowedOrigins = [`http://${IP}:8080`, `http://${IP}`];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  next();
});


app.get('/', (req, res) => {
  res.send('OK');
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
      browser = await playwright.firefox.launch({ headless: true });
      if (browser) {
        status = true;
        return res.status(200).json({ success: true, message: 'Logado!' });
      }
      return res.status(404).json({ success: false, message: 'Erro no TTN' });
    }

    return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
});


// Outras rotas (exemplo)
app.post('/TTNstart', async (req, res) => {
  if (status == false) {
    return res.status(404).json({ error: 'esta deslogado' });
  } else {
    if (!browser) {
      return res.status(404).json({ error: 'esta deslogado' });
    }
  }

  if (page) {
    browser.close();
    browser = await playwright.firefox.launch({ headless: true });
    page = await browser.newPage();
  }else{
    page = await browser.newPage();
  }
  await page.goto('https://qxbroker.com/en/sign-in/');
  await page.getByRole('textbox', { name: 'Email' }).fill('tradewener@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('wmgame9898');
  await new Promise(resolve => setTimeout(resolve, 1000));
  await page.getByRole('button', { name: 'Sign in' }).click();

  try {
    // Tente localizar o seletor com um tempo máximo de espera de 3 segundos.
    await page.waitForSelector('.button.button--primary.button--spaced > span', { timeout: 3000 });

    let verify = {
      msg: 'Falta verificação!',
      success: false
    };

    return res.status(404).json({verify});
  } catch (error) {
    let verify = {
      msg: 'SIM Automação concluída com sucesso!',
      success: true
    };

    return res.status(200).json(verify);

  }
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
      let verify = {
        msg: 'Logado com sucesso!',
        success: true
      };
      return res.status(200).json(verify);
    }

    if (i > 5) {
      return res.status(404).json('codigo incorreto');
    }

  }, 1500);

});

app.post('/TTNclose', (req, res) => {
  if (status == false) {
    return res.status(404).json({ Ttn: false, message: 'TTN está fechado' });
  }
  if (!page) {
    return res.status(200).json({ msg: 'ja esta fechado' });
  }
  page.close();
  return res.status(200).json({ msg: 'TTN foi fechado com sucesso' });
});

app.post('/logout', (req, res) => {
  if (status == false) {
    if (browser) {
      browser.close();
    }
    return res.status(404).json({ Ttn: false, message: 'TTN está fechado' });
  }
  browser.close();
  status = false;

  return res.status(200).json({ msg: 'logout realizado com sucesso' });
});

app.post('/Call', async (req, res) => {
  if (status == false) {
    return res.status(404).json({ Ttn: false, message: 'TTN está fechado' });
  }
  await page.locator(".button.button--success.button--spaced.call-btn.section-deal__button").click();

  res.send('compra executada');

});

app.post('/Put', async (req, res) => {
  if (status == false) {
    return res.status(404).json({ Ttn: false, message: 'TTN está fechado' });
  }
  await page.locator(".button.button--danger.button--spaced.put-btn.section-deal__button").click();

  res.send('Venda executada');

});

app.post('/hors', async (req, res) => {
  if (!browser) {
    return res.status(404).json({ Ttn: false, message: 'Esta desloggado!' });
  } else {
    if (status == false) {
      return res.status(404).json({ Ttn: false, message: 'TTN está fechado' });
    }
    if (!page) {
      return res.status(404).json({ Ttn: false, message: 'TTN está fechado' });
    }
  }

  const hors = await page.locator('.server-time.online');
  const preco_atual = await hors.innerText();
  const horarioRegex = /(\d{2}:\d{2}:\d{2})/;
  const match = preco_atual.match(horarioRegex);
  const horario = match ? match[1] : null;

  if (horario) {
    return res.status(200).json({ Ttn: false, hour: horario });
  }

  res.send('Venda executada');
});


app.post('/AlterCambio', async (req, res) => {
  const obj = req.body;

  if (status == false) {
    return res.status(404).json({ Ttn: false, message: 'TTN está fechado' });
  }
  await page.locator(".asset-select__button").click();
  await page.waitForTimeout(1000);
  await page.locator(".asset-select__search-input").fill(String(obj.ativo));
  await page.waitForTimeout(1000);
  await page.locator(".assets-table__name").click();

  res.send('Ativo trocado com sucesso!');

});