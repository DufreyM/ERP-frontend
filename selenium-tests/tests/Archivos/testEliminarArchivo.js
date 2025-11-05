const createDriver = require('../../helpers/driver');
const loginFlow = require('../../flows/loginFlow');
const navigateNavBar = require('../../flows/navigateNavBar');
const { By, until } = require('selenium-webdriver');

async function testArchivosDeleteFile() {
  const driver = createDriver();
  console.log("📌 Eliminar un archivo: ");

  try {
    await loginFlow(driver, 'leomejia646@gmail.com', 'hipopotamo_2025');
    await navigateNavBar(driver, "Archivos", "Archivos");

    await driver.sleep(2000);

    // Obtener el nombre del primer archivo antes de eliminarlo
    const primerArchivo = await driver.wait(
      until.elementLocated(By.xpath("//table//tbody//tr[1]//td[1]")),
      5000
    );
    const nombreArchivo = await primerArchivo.getText();
    console.log(`   📄 Archivo a eliminar: "${nombreArchivo}"`);

    // Buscar el span con title="Eliminar archivo" de la primera fila
    const eliminarSpan = await driver.wait(
      until.elementLocated(By.xpath("(//span[@title='Eliminar archivo'])[1]")),
      5000
    );
    
    console.log("   ✅ Encontrado el span de eliminar");

    // Esperar a que sea visible
    await driver.wait(until.elementIsVisible(eliminarSpan), 5000);

    // Hacer scroll para asegurarnos que está en el viewport
    await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", eliminarSpan);
    await driver.sleep(1000);

    // Usar JavaScript para hacer click (evita problemas de interceptación)
    await driver.executeScript("arguments[0].click();", eliminarSpan);
    
    console.log("   ✅ Click en botón de eliminar ejecutado");

    await driver.sleep(1000);

    // Verificar que apareció el popup de confirmación
    const popupTitle = await driver.wait(
      until.elementLocated(By.xpath(`//*[contains(text(), '¿Estas seguro de eliminar')]`)),
      5000
    );

    console.log(`   ✅ Popup de confirmación abierto`);

    // Confirmar la eliminación
    const confirmarBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Confirmar') or contains(text(), 'Eliminar') or contains(text(), 'Aceptar')]")),
      5000
    );
    
    // Usar JavaScript para el click
    await driver.executeScript("arguments[0].click();", confirmarBtn);
    
    console.log("   ⏳ Eliminando archivo...");

    await driver.sleep(1000);
    
    // Manejar el alert del navegador si existe
    try {
      const alert = await driver.switchTo().alert();
      const alertText = await alert.getText();
      console.log(`   ℹ️  Alert del navegador: "${alertText}"`);
      await alert.accept();
      console.log("   ✅ Alert aceptado");
    } catch (e) {
      console.log("   ℹ️  No hay alert del navegador");
    }

    // Esperar a que se procese la eliminación
    await driver.sleep(3000);

    // Verificar que el archivo ya no está en la tabla
    try {
      await driver.findElement(By.xpath(`//table//tbody//tr//td[text()='${nombreArchivo}']`));
      console.error('❌ El archivo todavía aparece en la tabla');
      
      // Debug: mostrar archivos actuales
      console.log('   📋 Archivos actuales en la tabla:');
      const archivos = await driver.findElements(By.xpath("//table//tbody//tr//td[1]"));
      for (let archivo of archivos) {
        const texto = await archivo.getText();
        console.log(`      - ${texto}`);
      }
      
    } catch (err) {
      // Si no encuentra el elemento, significa que fue eliminado exitosamente
      console.log('✅ Archivo eliminado exitosamente');
      console.log(`   🗑️  "${nombreArchivo}" ya no está en la tabla`);
    }

  } catch (err) {
    console.error('❌ Error al eliminar archivo:', err.message);
  } finally {
    await driver.quit();
  }
}

module.exports = testArchivosDeleteFile;