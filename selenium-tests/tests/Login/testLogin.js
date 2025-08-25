const createDriver = require('../../helpers/driver');
const loginFlow = require('../../flows/loginFlow');
const { By } = require('selenium-webdriver');

async function testLogin() {
  const driver = createDriver();
  console.log("📌 Flujo correcto: ");

  try {
    await loginFlow(driver, 'leomejia646@gmail.com', 'hipopotamo_2025');

    const dashboardHeader = await driver.findElement(By.tagName('h2')).getText();

    if (dashboardHeader === 'Local 1') {
      console.log('✅ Login exitoso');
    } else {
      console.error('❌ Login falló: no se encontró Dashboard');
    }
  } catch (err) {
    console.error('❌ Error en la prueba:', err);
  } finally {
    await driver.quit();
  }
}

module.exports = testLogin;