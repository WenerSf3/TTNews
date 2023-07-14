// import { firefox } from 'https://cdn.skypack.dev/playwright@1.11.0';
// const mysql = require('mysql');
const playwright = require('playwright');

// document.addEventListener('DOMContentLoaded', function () {
    const executarBotao = document.getElementById('executarBotao');
    executarBotao.addEventListener('click', async function () {
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        const browser = await playwright.firefox.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto('https://qxbroker.com/en/sign-in');
        const urlOriginal = await page.url();

        await page.getByRole('textbox', { name: 'Email' }).fill(`${email}`);
        await page.getByRole('textbox', { name: 'Password' }).fill(`${password}`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await page.getByRole('button', { name: 'Sign in' }).click();
        
        
        const calculo = await browser.newPage();
        await calculo.goto('https://br.tradingview.com/symbols/EURUSD/');
        const price = await calculo.locator('.last-JWoJqCpY.js-symbol-last');
        const elementValue = await price.innerText();
        await calculo.close();

        await page.locator('.section-deal__pending').click();

        const priceIncremented = elementValue * (1 + 0.0005);
        await page.locator('.form-pending-trade__input-text').fill(String(priceIncremented));
        await page.click('.form-pending-trade__button.green');

        await page.waitForTimeout(1000);

        const priceDecremented = elementValue - (elementValue * 0.0005);
        await page.locator('.form-pending-trade__input-text').fill(String(priceDecremented));
        await page.click('.form-pending-trade__button.red');

        await new Promise(resolve => setTimeout(resolve, 10000));

        await calculo.close();

        await new Promise(resolve => setTimeout(resolve, 10000));        

        // const calculo = await browser.newPage();
        // await calculo.goto('https://br.tradingview.com/symbols/EURUSD/');
        // const price = await calculo.locator('.last-JWoJqCpY.js-symbol-last');
        // const elementValue = await price.innerText();
        // await calculo.close();

        // await page.locator('.section-deal__pending').click();

        // const priceIncremented = elementValue * (1 + 0.0005);
        // await page.locator('.form-pending-trade__input-text').fill(String(priceIncremented));
        // await page.click('.form-pending-trade__button.green');

        // await page.waitForTimeout(1000);

        // const priceDecremented = elementValue - (elementValue * 0.0005);
        // await page.locator('.form-pending-trade__input-text').fill(String(priceDecremented));
        // await page.click('.form-pending-trade__button.red');

        // await new Promise(resolve => setTimeout(resolve, 10000));

        // await calculo.close();

        // await new Promise(resolve => setTimeout(resolve, 10000));

    });
// });
