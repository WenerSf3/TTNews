const playwright = require('playwright');
const mysql = require('mysql2');
const moment = require('moment');
const connection = require('./connection.js');

let trade = null;
let ativo = null;
let date = null;
let query = connection.promise();
const logado = async (page) => {

  if (page) {
    trade = page;
  }

  var [evento] = await query.query('SELECT * FROM eventos ORDER BY date ASC LIMIT 1');
  for (let i = 0; i < evento.length; i++) {
    let nivel = '';
    switch (evento[i].nivel) {
      case 1:
        nivel = '⭐';
        break;
      case 2:
        nivel = '⭐⭐';
        break;
      case 3:
        nivel = '⭐⭐⭐';
        break;
      default:
        nivel = 'N/A';
        break;
    }
    document.getElementById('items').innerHTML += `<div style="display: flex;gap: 10px;">
            <h5 style="color:white;text-shadow: 1px 1px 1px black,-1px -1px 1px black;">${i + 1}</h5>
            <h5 style="color:white;text-shadow: 1px 1px 1px black,-1px -1px 1px black;">${evento[i].evento}</h5>
            <h5 style="color:white;text-shadow: 1px 1px 1px black,-1px -1px 1px black;">${nivel}</h5>
      <h5 style="color:white;text-shadow: 1px 1px 1px black,-1px -1px 1px black;">${evento[i].date}</h5>
      <h5 style="color:white;text-shadow: 1px 1px 1px black,-1px -1px 1px black;">${evento[i].pavil}</h5>
      <h5 style="color:white;text-shadow: 1px 1px 1px black,-1px -1px 1px black;">${evento[i].confia}</h5>
      <h5 style="color:white;text-shadow: 1px 1px 1px black,-1px -1px 1px black;">${evento[i].ativo}</h5>
      </div>`;
  }

  ativo = evento[0].ativo;
  date = evento[0].date;
  let status = '';
  if (evento) {
    status = 'OK';
  }
  await trade.waitForTimeout(5000);

  if (status == 'OK') {
    EventTime(date, evento[0].id, evento[0].evento, evento[0].pavil);
  }

};
let elementValue = '';

async function cambioGetPrice(cambio) {
  const WebPrices = await playwright.firefox.launch({ headless: true });
  const calculo = await WebPrices.newPage();
  await calculo.goto('https://br.tradingview.com/symbols/' + cambio + '/technicals/');
  const price = await calculo.locator('.last-JWoJqCpY.js-symbol-last');
  elementValue = await price.innerText();
  console.log('precooo', elementValue);
  await calculo.close();
}

async function EventTime(event, evento, eventName, pips) {
  if (event === 'stop') {
    clearInterval(intervalo)
  }
  const horarioAlvo = moment(event, 'YYYY-MM-DD HH:mm:ss').subtract(126, 'seconds').add(1, 'minutes');
  let chamouFuncao = false;
  let chamouFuncao2 = false;
  let botao = document.getElementById('botao-iniciar');
  let estrategia = document.querySelector('input[name="option"]:checked').value
  botao.innerHTML = `INICIADO!`;

  botao.style = 'background-color:red;';
  var intervalo = setInterval(() => {
    if (moment() < horarioAlvo) {
      const segundosRestantes = horarioAlvo.diff(moment(), 'seconds');
      const duration = moment.duration(segundosRestantes, 'seconds');
      const dias = Math.floor(duration.asDays());
      const horas = String(duration.hours()).padStart(2, '0');
      const minutos = String(duration.minutes()).padStart(2, '0');
      const segundos = String(duration.seconds()).padStart(2, '0');
      document.getElementById('messagee').innerHTML = `<div id="countdown" style="display: flex; flex-direction: column; align-items: center; text-align: center; margin-top: 50px;"><div id="estrategia" style="color: green; font-size: 24px; font-weight: bold; margin-bottom: 10px;">${estrategia}</div><div id="tempoRestante" style="font-size: 18px; margin-bottom: 10px;">${dias} Dias ${horas}:${minutos}:${segundos} para o EVENTO!</div><div id="evento" style="font-size: 16px;position:relative;top:-15px;">${eventName}</div></div>`;
      if (segundosRestantes < 20 && !chamouFuncao2) {
        chamouFuncao2 = true;
        cambioGetPrice(ativo)
      }
      if (segundosRestantes === 0 && !chamouFuncao) {
        chamouFuncao = true;
        AllReady(document.querySelector('input[name="option"]:checked').value, evento, pips);
      }
    } else {
      clearInterval(intervalo);
    }
  }, 1000);

}


async function AllReady(data, event, pips) {

  await trade.locator('.section-deal__pending').click();
  await trade.waitForTimeout(1000);

  switch (data) {
    case 'buy':
      const price1 = elementValue * (1 + 0.0005(pips !== undefined && pips !== null ? pips : 0.00045));
      await trade.locator('.form-pending-trade__input-text').fill(String(price1));
      await trade.click('.form-pending-trade__button.green');
      break;

    case 'self':
      const price2 = elementValue - (elementValue * 0.0005);
      await trade.locator('.form-pending-trade__input-text').fill(String(price2));
      await trade.click('.form-pending-trade__button.red');
      break;

    case 'doubleGuard':
      
      const typeprice = null;
      if (pips.length == 3) {
        typeprice = 0.00 + pips;
      }
      if (pips.length == 2) {
        typeprice = 0.000 + pips;
      }
      if (pips.length == 1) {
        typeprice = 0.0000 + pips;
      }

      const price3 = elementValue + typeprice;
      await trade.locator('.form-pending-trade__input-text').fill(String(price3));
      await trade.click('.form-pending-trade__button.green');
      await trade.waitForTimeout(500);
      const price4 = elementValue - typeprice;
      await trade.locator('.form-pending-trade__input-text').fill(String(price4));
      await trade.click('.form-pending-trade__button.red');
      await trade.waitForTimeout(2000);
      await trade.click('#graph');
      break;

    case 'speedEvent':
      const speed = await playwright.firefox.launch({ headless: false });
      const speedclick = await speed.newPage();
      await speedclick.goto('https://br.investing.com/economic-calendar/');
      const projectionPrice = await speedclick.locator('#eventForecast_475150');
      projectionPrice1 = projectionPrice.innerText();

      const projectionPrice2 = await speedclick.locator('#eventActual_475150');
      projectionPrice2 = projectionPrice2.innerText();

      if (projectionPrice1 < projectionPrice2) {
        const price3 = elementValue * (1 + 0.0003);
        await trade.locator('.form-pending-trade__input-text').fill(String(price3));
        await trade.click('.form-pending-trade__button.green');
      } else {
        const price4 = elementValue - (elementValue * 0.0003);
        await trade.locator('.form-pending-trade__input-text').fill(String(price4));
        await trade.click('.form-pending-trade__button.red');

      }

      await speedclick.close();

      break;
    default:
      break;
  }

  await trade.click('.deal-list__tab > svg.icon-deal-list-orders');

  await trade.waitForTimeout(10000);

  for (let i = 0; i < 5; i++) {
    await trade.waitForTimeout(700);
    trade.click('.order__button');
  }
  await query.query(`DELETE FROM eventos WHERE id = ${event}`);

  await trade.click('.deal-list__tab > svg.icon-deal-list-trades');

  logado(trade);


}
module.exports = { logado };