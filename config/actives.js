const playwright = require("playwright");

async function getActive(active) {
  browser = await playwright.firefox.launch({ headless: true });
  page = await browser.newPage();

  switch (active) {
    case "EURUSD":
      await page.goto("https://br.tradingview.com/symbols/" + active + "/");

      break;
    case "GBPUSD":
      await page.goto("https://br.tradingview.com/symbols/" + active + "/");

      break;
    case "EURJPY":
      await page.goto("https://br.tradingview.com/symbols/" + active + "/");

      break;
    case "AUDCAD":
      await page.goto("https://br.tradingview.com/symbols/" + active + "/");

      break;
    case "USDJPY":
      await page.goto("https://br.tradingview.com/symbols/" + active + "/");

      break;
    case "EURGBP":
      await page.goto("https://br.tradingview.com/symbols/" + active + "/");
      break;

    default:
      break;
  }
  let price = await page.locator(".last-JWoJqCpY.js-symbol-last");
  price = await price.innerText();
  await page.close();
  
  console.log(`${active} price --->, ${price}`);

}
exports.getActive = getActive;
