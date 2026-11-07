// Unidad 3 · Clase 5 · La calibración
// Dos funciones separadas:
//   leerCrudo()  entrega el valor tal como llega, en la escala de la fuente
//   leerSenal()  lo traduce a 0–1 usando un rango MEDIDO, no supuesto
// Cambia leerCrudo() por la fuente de tu equipo (micrófono, cámara o datos).

let enjambre = [];
let cantidad = 40;
let diametro = 14;
let limiteVelocidad = 2;

// NUEVO: el rango real de la fuente. Se mide primero y después se escribe aquí.
let minimo = 0.2;
let maximo = 0.7;

// Para medir: lo más bajo y lo más alto que ha llegado
let minVisto = Infinity;
let maxVisto = -Infinity;

// -----------------------------------------
// LA FUENTE Y LA SEÑAL
// -----------------------------------------

// Simulada: noise() casi nunca baja de 0.2 ni sube de 0.7
function leerCrudo() {
  return noise(frameCount * 0.01);
}

function leerSenal() {
  let crudo = leerCrudo();
  let s = map(crudo, minimo, maximo, 0, 1);
  return constrain(s, 0, 1); // la promesa: siempre entre 0 y 1
}

function medir() {
  let crudo = leerCrudo();
  if (crudo < minVisto) {
    minVisto = crudo;
  }
  if (crudo > maxVisto) {
    maxVisto = crudo;
  }
}

// EL ENJAMBRE (igual que en la Clase 1)
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

function mostrar(a, s) {
  let d = map(s, 0, 1, 6, 40);
  noStroke();
  fill(46, 196, 230);
  circle(a.x, a.y, d);
}

// Una referencia mínima: la barra y lo que significan sus extremos
function mostrarReferencia(s) {
  noStroke();
  fill(220, 218, 230);
  rect(10, height - 30, width - 20, 10);
  fill(20);
  rect(10, height - 30, map(s, 0, 1, 0, width - 20), 10);
  textSize(11);
  text("bajo", 10, height - 8);
  textAlign(RIGHT);
  text("alto", width - 10, height - 8);
  textAlign(LEFT);
  textSize(12);
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

  medir();
  let s = leerSenal();

  for (let a of enjambre) {
    mover(a);
    aplicarBorde(a);
    mostrar(a, s);
  }
  mostrarReferencia(s);

  fill(20);
  noStroke();
  text("crudo: " + nf(leerCrudo(), 1, 3), 10, 20);
  text("visto: de " + nf(minVisto, 1, 3) + " a " + nf(maxVisto, 1, 3), 10, 36);
}
