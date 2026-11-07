// =====================================================================
// datos.js · Unidad 3 · pieza entregada
//
// No necesitas leer ni modificar este archivo para usarlo. Funciona igual
// que una librería: se carga con una línea en index.html, ANTES de
// sketch.js, y entrega una variable y dos funciones.
//
//   cargarDatos(direccion, minutos)
//       Pide los datos a una dirección de internet o a un archivo .json
//       del proyecto. Los pide al comienzo y después cada `minutos`.
//       Con minutos = 0 los pide una sola vez.
//
//   datos
//       La última respuesta que llegó, como objeto de JavaScript.
//       Vale null mientras no ha llegado ninguna.
//
//   segundosSinDatos()
//       Cuántos segundos han pasado desde la última respuesta buena.
//       Si nunca llegó ninguna, devuelve Infinity (infinito).
//
// Por qué va aparte: pedir datos por internet obliga a esperar una
// respuesta que llega "más tarde", y eso usa herramientas de JavaScript
// que no son parte de este curso. Aquí quedan escondidas.
// =====================================================================

let datos = null;
let _momentoUltimaRespuesta = null;

function cargarDatos(direccion, minutos) {
  _pedirDatos(direccion);
  if (minutos > 0) {
    setInterval(function () {
      _pedirDatos(direccion);
    }, minutos * 60 * 1000);
  }
}

function segundosSinDatos() {
  if (_momentoUltimaRespuesta === null) {
    return Infinity;
  }
  return (Date.now() - _momentoUltimaRespuesta) / 1000;
}

function _pedirDatos(direccion) {
  fetch(direccion)
    .then(function (respuesta) {
      if (!respuesta.ok) {
        throw new Error("respuesta " + respuesta.status);
      }
      return respuesta.json();
    })
    .then(function (json) {
      datos = json;
      _momentoUltimaRespuesta = Date.now();
    })
    .catch(function (error) {
      console.warn("datos.js: no llegaron datos de " + direccion + " (" + error.message + ")");
    });
}
