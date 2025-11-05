const createDriver = require('../../helpers/driver');
const loginFlow = require('../../flows/loginFlow');
const navigateNavBar = require('../../flows/navigateNavBar');
const { By, until } = require('selenium-webdriver');

async function testArchivosEditFile() {
  const driver = createDriver();
  console.log("📌 Editar un archivo existente: ");

  try {
    await loginFlow(driver, 'leomejia646@gmail.com', 'hipopotamo_2025');
    await navigateNavBar(driver, "Archivos", "Archivos");

    await driver.sleep(2000);

    // Buscar el span con title="Editar archivo" de la primera fila
    const editarSpan = await driver.wait(
      until.elementLocated(By.xpath("(//span[@title='Editar archivo'])[1]")),
      5000
    );
    
    console.log("   ✅ Encontrado el span de editar");

    // Esperar a que sea visible
    await driver.wait(until.elementIsVisible(editarSpan), 5000);

    // Hacer scroll para asegurarnos que está en el viewport
    await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", editarSpan);
    await driver.sleep(1000);

    // Usar JavaScript para hacer click (evita problemas de interceptación)
    await driver.executeScript("arguments[0].click();", editarSpan);
    
    console.log("   ✅ Click en botón de editar ejecutado");

    await driver.sleep(1000);

    // Verificar que se abrió el popup de editar
    const popupTitle = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(), 'Editar un archivo')]")),
      5000
    );

    console.log("   ✅ Popup de editar abierto");

    // Modificar el nombre del archivo
    const nombreInput = await driver.wait(
      until.elementLocated(By.css('input[placeholder*="Asignar nombre visible"]')),
      5000
    );
    
    const nombreActual = await nombreInput.getAttribute('value');
    console.log(`   📝 Nombre actual: "${nombreActual}"`);
    
    await nombreInput.clear();
    await driver.sleep(300);
    
    const nuevoNombre = `Editado ${Date.now()}`;
    await nombreInput.sendKeys(nuevoNombre);
    
    console.log(`   📝 Nuevo nombre: "${nuevoNombre}"`);

    await driver.sleep(500);

    // Click en guardar (buscar dentro del popup)
    const guardarBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Aceptar') or contains(text(), 'Confirmar')]")),
      5000
    );
    
    // Usar JavaScript para el click también aquí
    await driver.executeScript("arguments[0].click();", guardarBtn);
    
    console.log("   ⏳ Guardando cambios...");

    // Esperar recarga
    await driver.sleep(3000);

    // Verificar que el nombre cambió
    try {
      const archivoEditado = await driver.wait(
        until.elementLocated(By.xpath(`//table//tbody//tr//td[contains(text(), '${nuevoNombre}')]`)),
        5000
      );
      console.log('✅ Archivo editado exitosamente');
    } catch (e) {
      console.error('❌ El archivo no se editó correctamente');
      console.error('   Buscando:', nuevoNombre);
    }

  } catch (err) {
    console.error('❌ Error al editar archivo:', err.message);
  } finally {
    await driver.quit();
  }
}

module.exports = testArchivosEditFile;