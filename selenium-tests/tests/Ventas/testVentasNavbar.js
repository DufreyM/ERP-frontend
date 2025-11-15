const createDriver = require('../../helpers/driver');
const loginFlow = require('../../flows/loginFlow');
const { By, until } = require('selenium-webdriver'); // ← Asegúrate de tener until aquí también
const navigateNavBar = require('../../flows/navigateNavBar');

async function testComprasVentasNavbar() {
  const driver = createDriver();
  console.log("📌 Verificar navegación a Compras y Ventas: ");

  try {
    await loginFlow(driver, 'leomejia646@gmail.com', 'hipopotamo_2025');

    // Navegar a Compras/Ventas (por defecto abre Ventas)
    await navigateNavBar(driver, "Compras Ventas", "Historial de ventas");
    
    await driver.sleep(2000);

    // ===== VERIFICAR VENTAS =====
    console.log("   🔍 Verificando pantalla de Ventas...");
    try {
      const tituloVentas = await driver.findElement(By.xpath("//h1[contains(text(), 'Historial de ventas')]"));
      console.log("   ✅ Navegación a Ventas exitosa");
    } catch (e) {
      console.error("   ❌ No se encontró la pantalla de Ventas");
    }

    // ===== NAVEGAR Y VERIFICAR COMPRAS =====
    console.log("   🔄 Navegando a Compras...");
    
    const botonCompras = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Compras')]")),
      5000
    );

    await driver.executeScript("arguments[0].click();", botonCompras);
    await driver.sleep(2000);

    try {
      const tituloCompras = await driver.findElement(By.xpath("//h1[contains(text(), 'Historial de compras')]"));
      console.log("   ✅ Navegación a Compras exitosa");
    } catch (e) {
      console.error("   ❌ No se encontró la pantalla de Compras");
    }

    console.log("✅ Test completado");

  } catch (err) {
    console.error('❌ Error en la prueba:', err.message);
  } finally {
    await driver.quit();
  }
}

module.exports = testComprasVentasNavbar;