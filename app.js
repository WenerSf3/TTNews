const { search_event } = require('./config/events.js');
const connection = require('./config/connection.js');
const playwright = require('playwright');
let database = connection.promise();
const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs');
const app = express();
app.use(express.json());
const { createNewEvent,
        disableEvents,
        enableEvents,
        deleteEvent,
        getStatus,
        getEvents,
        EditEvent } = require('./config/database.js');

if (fs.existsSync('./dev.v')) {
  dotenv.config({ path: '.env.development' });
} else {
  dotenv.config();
}

let browser;
let page;
let status = false;

const PORT = process.env.PORT;
const IP = process.env.IP;
app.use(cors());

app.listen(PORT, () => {
  console.log(`API rodando em http://${IP}:${PORT}`);
});

app.get('/', (req, res) => {
  res.send('OK');
});

app.post('/preparingEvent', (req, res) => {

  if (status == false && !page) {
    return res.status(404).json({ Ttn: false, message: 'TTN está fechado' });
  }
  search_event(page, 'start');
  return res.send('Ok!');

});
app.get('/checkBtn', async (req, res) => {

  const [account] = await database.query(
    'SELECT * FROM users LIMIT 1;');

  return res.status(200).json({ success: true, status: account[0].search });
});

app.post('/startprocess', async (req, res) => {
  const request = req.body;

  if (status == false) {
    return res.status(404).json({ Ttn: false, message: 'TTN está fechado' });
  }
  if (!page) {
    return res.status(200).json({ msg: 'ja esta fechado' });
  }

  if (request.argument == 'start') {
    await enableEvents();
    const [account] = await database.query(
      'SELECT * FROM users LIMIT 1;');

    return res.status(200).json({ success: true, message: 'Ligado com sucesso', statuss: account[0].search });

  }
  if (request.argument == 'stop') {
    await disableEvents();
    const [account] = await database.query(
      'SELECT * FROM users');
    return res.status(200).json({ success: true, message: 'Ligado com sucesso', statuss: account[0].search });
  }
  return res.status(404).json({ success: false, message: 'Erro no TTN' });

});

app.post('/login', async (req, res) => {
  try {
    const request = req.body;

    const [account] = await database.query(
      'SELECT * FROM users WHERE email = ? AND password = ? AND `key` = ? LIMIT 1',
      [request.email, request.password, request.key]
    );

    if (account.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    if (page && page.url() == 'https://qxbroker.com/en/trade') {
      return res.status(200).json({
        success: true,
        message: 'Já está logado!',
        user: account[0],
        ttnstart: 'started'
      });
    }

    if (!browser) {
      browser = await playwright.firefox.launch({ headless: false });
    }
    status = true;

    return res.status(200).json({
      success: true,
      message: 'Login bem-sucedido!',
      user: account[0],
      ttnstart: 'notstarted'
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
});

app.post('/TTNstart', async (req, res) => {
  try {
    if (status === false || !browser) {
      return res.status(404).json({ error: 'está deslogado' });
    }

    if (page) {
      await page.close();
    }

    browser = await playwright.firefox.launch({ headless: false });
    page = await browser.newPage();

    await page.goto('https://qxbroker.com/en/sign-in/');
    await page.waitForLoadState('domcontentloaded');
    await page.getByRole('textbox', { name: 'Email' }).fill('tradewener@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('wmgame9898');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.getByRole('button', { name: 'Sign in' }).click();
    await new Promise(resolve => setTimeout(resolve, 2500));
    await page.waitForTimeout(1000);

    const errorElement = await page.$('form > .modal-sign__input > .hint.-danger');
    if (errorElement) {
      const elementText = await errorElement.innerText();
      return res.status(200).json({ msg: 'conta incorreta', success: 'fail_1' });
    }

    try {
      await page.waitForSelector('.button.button--primary.button--spaced > span', { timeout: 2000 });
      let verify = {
        msg: 'Falta verificação!',
        success: 'fail_2'
      };

      return res.status(200).json(verify);
    } catch (error) {
      let verify = {
        msg: 'SIM Automação concluída com sucesso!',
        success: true
      };

      return res.status(200).json(verify);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Erro no servidor', success: false });
  }
});




app.post('/createEvent', async (req, res) => {
  const request = req.body;

  if (status == false) {
    return res.status(404).json({ Ttn: false, message: 'TTN está fechado' });
  }

  let created = createNewEvent(request);
  if (created) {
    return res.status(200).json({ success: true, msg: 'criado com sucesso!' });

  }
  return res.status(404).json({ success: false, msg: 'erro!' });
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
      try {
        return res.status(404).json('codigo incorreto');
      } catch (error) {
        return;
      }
    }

  }, 1500);

});

app.post('/changeBank', async (req, res) => {
  const request = req.body;

  if (status == false) {
    return res.status(404).json({ Ttn: false, message: 'TTN está fechado' });
  }
  if (!page) {
    return res.status(200).json({ msg: 'ja esta fechado' });
  }
  let url = page.url();

  if (url != 'https://qxbroker.com/en/demo-trade/' && request.bank == 'demo') {
    await page.goto('https://qxbroker.com/en/demo-trade/');
    return res.status(200).json({ msg: 'Conta trocada para Demo' });
  } else if (url != 'https://qxbroker.com/en/trade/' && request.bank == 'real') {
    await page.goto('https://qxbroker.com/en/trade/');
    return res.status(200).json({ msg: 'Conta trocada para real' });
  }
  return res.status(200).json({ msg: 'Sua conta já esta onde deseja!' });
});

app.post('/TTNclose', (req, res) => {
  if (status == false) {
    return res.status(404).json({ Ttn: false, message: 'TTN está fechado' });
  }
  if (!page) {
    return res.status(200).json({ msg: 'TTN stá fechado' });
  }
  page.close();
  page = null;
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

app.post('/editEvent', async (req, res) => {

  const request = req.body;



  let [updatedEvent] = await database.execute(
    `UPDATE events SET level=?, name=?, active=?, status=?, pips=?, investing=?, date=? WHERE id=?`,
    [
      request.nivel,
      request.event_name,
      request.cambio,
      request.posicao,
      request.pavil.toString(),
      10,
      request.date,
      request.id
    ]
  );
  return res.status(200).json({ success: true, message: 'editado com sucesso!', Event: updatedEvent });

});
app.post('/deleteEvent', async (req, res) => {
  const request = req.body;
  const [evento] = await database.execute(
    `DELETE FROM events WHERE id = ${request.id};`
  );
  return res.status(200).json({ Ttn: false, message: 'deletado com sucesso!', event: evento });

});

app.post('/Put', async (req, res) => {
  if (status == false) {
    return res.status(404).json({ Ttn: false, message: 'TTN está fechado' });
  }
  await page.locator(".button.button--danger.button--spaced.put-btn.section-deal__button").click();

  res.send('Venda executada');

});

// app.post('/hors', async (req, res) => {
//   if (!browser) {
//     return res.status(404).json({ Ttn: false, message: 'Esta desloggado!' });
//   } else {
//     if (status == false) {
//       return res.status(404).json({ Ttn: false, message: 'TTN está fechado' });
//     }
//     if (!page) {
//       return res.status(404).json({ Ttn: false, message: 'TTN está fechado' });
//     }
//   }

//   const hors = await page.locator('.server-time.online');
//   const preco_atual = await hors.innerText();
//   const horarioRegex = /(\d{2}:\d{2}:\d{2})/;
//   const match = preco_atual.match(horarioRegex);
//   const horario = match ? match[1] : null;

//   if (horario) {
//     return res.status(200).json({ Ttn: false, hour: horario });
//   }

//   res.send('Venda executada');
// });


app.post('/AlterCambio', async (req, res) => {
  const obj = req.body;
  console.log('trocando ativo')
  if (!status) {
    return res.status(404).json({ Ttn: false, message: 'TTN está fechado' });
  }

  try {
    await page.click(".asset-select__button", { timeout: 1000 });
  } catch (e) {
  }

  await page.waitForTimeout(500);

  try {
    await page.locator(".asset-select__search-input", { timeout: 1000 }).fill(String(obj.ativo));
  } catch (e) {
  }

  await page.waitForTimeout(500);

  try {
    await page.click(".assets-table__name", { timeout: 1000 });
  } catch (e) {
  }

  return res.status(200).json({ success: true, message: 'Ativo trocado com sucesso!' });
});

app.post('/antiLogout', async (req, res) => {

  if (status == false) {
    return;
  }
  try {
    await page.click(".deal-list__tab > svg.icon-deal-list-orders");
    await page.waitForTimeout(1000);
    await page.click(".deal-list__tab > svg.icon-deal-list-trades");
  } catch (error) {
    return;
  }


});

app.get('/getEvents', async (req, res) => {

  if (status == false) {
    return;
  } else {
    try {
      const [eventos] = await database.execute(`SELECT * FROM events;`);
      return res.status(200).json({ success: true, list: eventos });
    } catch (error) {
      return res.status(404).json({ erro: error });
    }

  }

});

app.post('/closePendent', async (req, res) => {

  if (status == false) {
    return res.status(404).json({ Ttn: false, message: 'TTN está fechado' });
  }
  try {
    await page.click(".deal-list__tab > svg.icon-deal-list-orders");
    await page.click(".order__button", { timeout: 2000 });
    await page.click(".deal-list__tab > svg.icon-deal-list-trades");
    return res.send('fechado com sucesso!');
  } catch (error) {
    await page.click(".deal-list__tab > svg.icon-deal-list-trades");
    return res.send('fechado com sucesso!');
  }


});