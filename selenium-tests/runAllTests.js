const testAlertaNavBar = require('./tests/Alertas/testAlertaNavBar');
const testArchivosFindPage = require('./tests/Archivos/testArchivosFindPage');
const testArchivosEditFile = require('./tests/Archivos/testEditarArchivo');
const testArchivosDeleteFile = require('./tests/Archivos/testEliminarArchivo');
const testCalendarFindPage = require('./tests/Calendar/testCalendarFindPage');
const testEmpleadosNavbar = require('./tests/Empleados/testEmpleado');
const testLogin = require('./tests/Login/testLogin');
const testLoginGoToResertPassword = require('./tests/Login/testLoginGoToResetPassword');
const testLoginGoToVisitador = require('./tests/Login/testLoginGoToVisitador');
const testLoginIncorrectMail = require('./tests/Login/testLoginIncorrectMail');
const testLoginIncorrectPassword = require('./tests/Login/testLoginIncorrectPassword');
const testLoginNoData = require('./tests/Login/testLoginNoData');
const testMiPerfilNavbar = require('./tests/MiPerfil/testMiPerfilNavbar');
const testComprasVentasNavbar = require('./tests/Ventas/testVentasNavbar');
const testVisitadoresNavbar = require('./tests/Visitadores/testVisitadoresNavbar');


(async () => {
  console.log('🔍 Ejecutando pruebas...');
  console.log('');

  console.log("🔍 Tests de la pantalla de login...  ");
  await testLoginIncorrectMail();
  await testLoginIncorrectPassword();
  await testLoginNoData();
  await testLoginGoToVisitador();
  await testLoginGoToResertPassword();
  await testLogin();
 
  console.log('');
  console.log("🔍 Tests de la pantalla de calendario...  ");
  await testCalendarFindPage();

  console.log("🔍 Tests de la pantalla de Archivos...  ");
  await testArchivosFindPage();
  await testArchivosEditFile();
  await testArchivosDeleteFile();

  await testAlertaNavBar();
  await testVisitadoresNavbar();
  await testComprasVentasNavbar();
  await testMiPerfilNavbar();
  await testEmpleadosNavbar();


  
  // Puedes ejecutar en orden o en paralelo, si querés

  console.log('🎉 Todas las pruebas terminaron 🎉');
})();