// Unidad 3 · Clase 1 · La señal
// El enjambre de la Unidad 2, con una novedad: una función que entrega
// un número entre 0 y 1 que el resto del programa no inventa.

let enjambre = [];
let cantidad = 40;
let diametro = 14;
let limiteVelocidad = 2;

// NUEVO: de dónde viene la señal. Prueba "mouse" y "ruido".
let fuente = "mouse";

// -----------------------------------------
// LA SEÑAL
// No recibe nada y devuelve un número entre 0 y 1.
// Es la única función que sabe de dónde viene el dato.
// -----------------------------------------

function leerSenal() {
  if (fuente === "mouse") {
    return mouseX / width; // ojo: saca el mouse del lienzo y mira el valor
  }
  if (fuente === "ruido") {
    return noise(frameCount * 0.01);
  }
  return 0;
}

// -----------------------------------------
// EL ENJAMBRE (igual que en la Unidad 2)
// -----------------------------------------

function crearEnjambre() {
  for (let i = 0; i < cantidad; i++) {
    enjambre.push({
      x: random(diametro, width - diametro),
      y: random(diametro, height - diametro),
      vx: random(-limiteVelocidad, limiteVelocidad),
      vy: random(-limiteVelocidad, limiteVelocidad),
    });
  }
}

function mover(a) {
  a.x += a.vx;
  a.y += a.vy;
}

function aplicarBorde(a) {
  if (a.x < diametro / 2 || a.x > width - diametro / 2) {
    a.vx *= -1;
    a.x = constrain(a.x, diametro / 2, width - diametro / 2);
  }
  if (a.y < diametro / 2 || a.y > height - diametro / 2) {
    a.vy *= -1;
    a.y = constrain(a.y, diametro / 2, height - diametro / 2);
  }
}

// La señal llega como parámetro: mostrar() no sabe de dónde viene.
function mostrar(a, s) {
  let d = map(s, 0, 1, 6, 40);
  noStroke();
  fill(46, 196, 230);
  circle(a.x, a.y, d);
}

// -----------------------------------------
// P5
// -----------------------------------------

function setup() {
  createCanvas(400, 400);
  crearEnjambre();
}

function draw() {
  background(245, 243, 235);

  let s = leerSenal();

  for (let a of enjambre) {
    mover(a);
    aplicarBorde(a);
    mostrar(a, s);
  }

  // Para revisar: el valor que está llegando
  fill(20);
  text("señal: " + round(s * 100) + " %", 10, 20);
}
