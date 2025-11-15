const createDriver = require('../../helpers/driver');
const loginFlow = require('../../flows/loginFlow');
const { By } = require('selenium-webdriver');
const navigateNavBar = require('../../flows/navigateNavBar');

async function testMiPerfilNavbar() {
  const driver = createDriver();
  //console.log("📌 Crear nuevo evento en calendario: ");

  try {
    await loginFlow(driver, 'leomejia646@gmail.com', 'hipopotamo_2025');

    await navigateNavBar(driver, "Mi perfil", "Mi perfil");
    const calendarHeader = await driver.findElement(By.tagName('h1')).getText();

    // if (calendarHeader === 'Calendario de actividades') {
    //   console.log('✅ Login exitoso');
    // } else {
    //   console.error('❌ Login falló: no se encontró Dashboard');
    // }
  } catch (err) {
    console.error('❌ Error en la prueba:', err);
  } finally {
    await driver.quit();
  }
}

module.exports = testMiPerfilNavbar;