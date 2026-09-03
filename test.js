
const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

    await page.goto('file://' + 'C:/Users/vigne/OneDrive/Desktop/Mern/project/index.html', { waitUntil: 'networkidle0' });
    console.log('Page loaded');

    // Fill register form
    await page.type('#reg-name', 'Test');
    await page.type('#reg-email', 'test@test.com');
    await page.type('#reg-pwd', 'test');
    await page.click('#registerForm button');

    console.log('Clicked register');
    await new Promise(r => setTimeout(r, 1000));
    console.log('Waited 1s');

    await browser.close();
})();
