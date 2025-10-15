const { By } = require('selenium-webdriver');

async function loginFlow(driver, username, password) {
    await driver.get(`${import.meta.env.VITE_API_URL}`);

    await driver.findElement(By.css('input[placeholder="Correo"]')).sendKeys(username);
    await driver.findElement(By.css('input[placeholder="Contraseña"]')).sendKeys(password);

    await driver.findElement(By.xpath('//button[contains(text(), "Iniciar Sesión")]')).click();

    // Puedes esperar o verificar que entraste
    await driver.sleep(2000); // Espera 2s o mejor usar WebDriverWait
}

module.exports = loginFlow;
