const createDriver = require('../../helpers/driver');
const loginFlow = require('../../flows/loginFlow');
const { By, until } = require('selenium-webdriver');

async function testLoginIncorrectMail() {
  const driver = createDriver();
  console.log("📌 Prueba con correo equivocado: ");

  try {

    await loginFlow(driver, 'leomejia646@.com', 'hipopotamo_2025');

    const alerta = await driver.wait(
      //until.elementLocated(By.xpath("//*[contains(text(), 'correo') and contains(text(), 'incorrectos')]")),
      until.elementLocated(By.xpath("//*[contains(text(), 'Correo electrónico o contraseña incorrectos.')]")),
      5000
    )
    const alertaTexto = await alerta.getText();

    if (alertaTexto.includes('Correo electrónico o contraseña incorrectos.')) {
      console.log('✅ Apareció la alerta de error como se esperaba');
    } else {
      console.error('❌ No apareció el mensaje de error esperado');
    }

  } catch (err) {
    console.error('❌ Error en la prueba de login incorrecto:', err);
  } finally {
    await driver.quit();
  }
}

module.exports = testLoginIncorrectMail;