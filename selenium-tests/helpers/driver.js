//este archivo configura el navegador en el que se va a ejecutar las pruebas
const {Builder} = require('selenium-webdriver');

function createDriver() {
    return new Builder().forBrowser('chrome').build();
}

module.exports = createDriver;