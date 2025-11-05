const { By, until } = require('selenium-webdriver');

async function navigateNavBar(driver, name, expected) {
    console.log(`📌 Navegar a la pagina de ${name}:`);

    // Buscar el elemento que contiene el texto (puede estar en el <a> o en el <p> dentro)
    const navButton = await driver.wait(
      until.elementLocated(By.xpath(`//*[contains(text(), '${name}')]`)),
      5000
    );
    
    await navButton.click();

    await driver.sleep(2000); 

    const palabraClave = await driver.findElement(By.tagName('h1')).getText();

    if (palabraClave === expected || palabraClave.includes(expected)) {
      console.log(`✅ Navegación a ${name} existosa`);
    } else {
      console.error(`❌ Falló la navegación a ${name}`);
    }
}

module.exports = navigateNavBar;