const playwright = require("playwright");
const moment = require('moment');

async function getActive(active) {

    const webActive = await playwright.firefox.launch({ headless: true });
    const page = await webActive.newPage();
    
    await page.goto(`https://br.tradingview.com/symbols/${active}/`);
    
    const priceElement = await page.locator(".last-JWoJqCpY.js-symbol-last");
    await page.waitForTimeout(700);
    const price = await priceElement.innerText();
    console.log('peguei -->', moment().format('mm:ss'))
  
    await webActive.close();
    return price;
  
}

exports.getActive = getActive;
