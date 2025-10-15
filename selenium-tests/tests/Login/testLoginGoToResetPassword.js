const createDriver = require('../../helpers/driver');
const { By, until } = require('selenium-webdriver');

async function testLoginGoToResertPassword() {
  const driver = createDriver();
  console.log("📌 Navegar a la pantalla de visitadores médicos:");

  try {
    await driver.get(`${import.meta.env.VITE_API_URL}`);

    // Esperar el body para confirmar que cargó la página
    await driver.wait(until.elementLocated(By.tagName('body')), 5000);

    // Esperar y encontrar el botón que contiene "Ingresa"
    const boton = await driver.wait(
      until.elementLocated(By.xpath("//button[.//span[text()='Reestablecer']]")),
      10000
    );

    //console.log("🔘 Botón 'Ingresa' encontrado, haciendo scroll...");
    await driver.executeScript("arguments[0].scrollIntoView(true);", boton);

    //console.log("🖱️ Ejecutando click con acciones...");
    await driver.actions({ bridge: true }).move({ origin: boton }).click().perform();
    await driver.sleep(2000);
    //console.log("⏳ Esperando a que aparezca la pantalla de visitadores...");

    // Esperar a que el título "Datos del visitador" aparezca (nuevo contenido)
    const header = await driver.wait(
      until.elementLocated(By.xpath("//h1[contains(text(), 'contraseña')]")),
      5000
    );

    const text = await header.getText();
    //console.log("🔍 Texto del header:", text);

    if (text.includes("contraseña")) {
      console.log('✅ Se navegó correctamente a la pantalla de reestablecer contraseña');
    } else {
      console.error('❌ No se navegó a reestablecer contraseñas');
    }

  } catch (err) {
    console.error('❌ Error en la prueba:', err);
  } finally {
    await driver.quit();
  }
}

module.exports = testLoginGoToResertPassword;


