const { By } = require('selenium-webdriver');

async function navigateNavBar(driver, name, expected) {
    console.log(`📌 Navegar a la pagina de ${name}:`);

    await driver.findElement(By.xpath(`//*[contains(text(), '${name}')]`)).click();

    await driver.sleep(2000); 

    const palabraClave = await driver.findElement(By.tagName('h1')).getText();

    if (palabraClave === expected) {
      console.log(`✅ Navegación a ${name} existosa`);
    } else {
      console.error(`❌ Falló la avegación a ${name}`);
    }
}

module.exports = navigateNavBar
