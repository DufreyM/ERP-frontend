const createDriver = require('../../helpers/driver');
const loginFlow = require('../../flows/loginFlow');
const { By, until } = require('selenium-webdriver');

async function testLoginNoData() {
  const driver = createDriver();
  console.log("📌 Prueba con campos vacíos: ");

  try {

    await loginFlow(driver, '', '');

    const alerta = await driver.wait(
      //until.elementLocated(By.xpath("//*[contains(text(), 'correo') and contains(text(), 'incorrectos')]")),
      until.elementLocated(By.xpath("//*[contains(text(), 'Por favor, completa todos los campos')]")),
      5000
    )
    const alertaTexto = await alerta.getText();

    if (alertaTexto.includes('Por favor, completa todos los campos')) {
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

module.exports = testLoginNoData;