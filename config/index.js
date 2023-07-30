const moment = require("moment");
const playwright = require('playwright');


async function pegar_evento() {
    let browser = await playwright.firefox.launch({ headless: true });
    let trade = await browser.newPage();
    await trade.goto('https://qxbroker.com/en/sign-in/');
    await trade.getByRole('textbox', { name: 'Email' }).fill('tradewener@gmail.com');
    await trade.getByRole('textbox', { name: 'Password' }).fill('wmgame9898');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await trade.getByRole('button', { name: 'Sign in' }).click();
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    await trade.goto('https://qxbroker.com/en/demo-trade/');
    await trade.waitForTimeout(15000);
    
    let self = (parseFloat('0.88042') - (100/100000)).toFixed(5);
    let buy = (parseFloat('0.88042') + (100/100000)).toFixed(5);
    
    await trade.locator(".section-deal__pending").click();
    await trade.locator(".form-pending-trade__input-text").fill(String(buy));
    await trade.click(".form-pending-trade__button.green");
    await trade.waitForTimeout(500);
    await trade.locator(".form-pending-trade__input-text").fill(String(self));
    await trade.click(".form-pending-trade__button.red");

    await trade.click("#graph");

    await trade.click(".deal-list__tab > svg.icon-deal-list-orders");
    await trade.dblclick(".order__button"); 
    await trade.click(".deal-list__tab > svg.icon-deal-list-trades");

}

pegar_evento();