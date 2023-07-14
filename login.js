const playwright = require('playwright');
const settingss = require('./settings.js');

async function login() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let message = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');
    let login = document.getElementById('login');
    let loading = document.getElementById('loading');
    let listagem = document.getElementById('listagem');

    login.style.display = 'none';
    loading.style.display = 'block';
    const browser = await playwright.firefox.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://qxbroker.com/en/sign-in/');
    await page.getByRole('textbox', { name: 'Email' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.getByRole('button', { name: 'Sign in' }).click();
    email.value = '';
    password.value = '';
    await page.waitForNavigation({ timeout: 0 });
    await new Promise(resolve => setTimeout(resolve, 3000));
    let newUrl = page.url();
    if (newUrl != 'https://qxbroker.com/en/sign-in/') {
        await settingss.logado(page);
        logado.style.display = 'flex';
        submitBtn.style.display = 'none';
        login.style.display = 'none';
        listagem.style.display = 'block';
        loading.style.display = 'none';
        document.getElementById('barra-lateral').style = 'display:flex;';
        await clearInterval(interval);
    }
    browser.close();

    login.style.display = 'flex';
    loading.style.display = 'none';
    email.style = 'background-color:red;';
    password.style = 'background-color:red;';
    message.innerHTML = 'Email ou Senha Incorretos!';

    setTimeout(() => {
        email.style = 'background-color:white;';
        password.style = 'background-color:white;';
        message.innerHTML = '';
    }, 1000);

}