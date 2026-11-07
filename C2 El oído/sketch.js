// Unidad 3 · Clase 2 · El oído
// La primera señal real: el nivel de sonido del lugar.
// Ojo: el micrófono solo funciona si abres el proyecto con Live Server
// (localhost) y el navegador te da permiso.

let enjambre = [];
let cantidad = 40;
let diametro = 14;
let limiteVelocidad = 2;

// De dónde viene la señal: "micro", "mouse", "ruido" o "camara"
let fuente = "camara";

// NUEVO: el objeto que representa al micrófono
let mic;
let microActivo = false;

let video;
let camActiva = false;
let senal = 0
// -----------------------------------------
// LA SEÑAL
// No recibe nada y devuelve un número entre 0 y 1.
// -----------------------------------------

function leerSenal() {
  if (fuente === "micro") {
    // getLevel() entrega valores pequeños: casi siempre bajo 0.2.
    // Este 0.2 es una primera suposición; se ajusta en la Clase 5.
    return map(mic.getLevel(), 0, 0.2, 0, 1);
  }
  if (fuente === "mouse") {
    let lecturaMouse = mouseX / width
    lecturaMouse = constrain(lecturaMouse, 0, 1);
    return lecturaMouse;
  }
  if (fuente === "ruido") {
    return noise(frameCount * 0.01);
  }
  if (fuente === "camara") {
    return brilloPromedio() / 255;
}
  return 0;
}

// -----------------------------------------
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

//A la función "mostrar" se le agregó condicionales para que cambie a color rojo
// y a forma de cuadrado cuando la señal supera el 90% (0.9), en caso contrario, que sea azul y circular.
function mostrar(a, s) {
  noStroke();
  if(s > 0.9) {
    fill(255, 0, 0);
  } else {
    fill(46, 196, 230);
  }
  if(s > 0.9) {
    square(a.x, a.y, diametro);
  } else {
    circle(a.x, a.y, diametro);
  }
  let vx = map(a.x, 0, width, 0, video.width);
  let vy = map(a.y, 0, height, 0, video.height);
  fill(video.get(vx, vy));
}

//"textoMicro" es una nueva función que junta el texto que indica hacer clic para activar el micrófono 
// y el texto que indica la señal de sonido (que ya formaba parte del código original) y el nuevo texto
// que indica si el micrófono está activo o no.
function textoMicro(s){
  fill(20);
  noStroke();
  if (fuente === "micro" && !microActivo) {
    text("haz clic en el lienzo para activar el micrófono", 10, 20);
  } else {
    text("señal: " + round(s * 100) + " %", 10, 20);
  }
  text(nf(mic.getLevel(), 1, 3), 10, 40);

  if(fuente === "micro" && !microActivo) {
    textSize(18);
    fill(255, 0, 0);
    text("Micrófono inactivo", 10, 60);
  }
  if(fuente === "micro" && microActivo) {
    textSize(18);
    fill(0, 255, 0);
    text("Micrófono activo", 10, 60);
  }
}

function textoCamara() {
  fill(20);
  noStroke();
  if(fuente === "camara" ) {
    text("Cámara activa", 10, 60);
    text("Brillo promedio: " + round(brilloPromedio()), 10, 80);
  }
}

function brilloPromedio() {
  let suma = 0;
  let n = 0;
  for (let x = 5; x < video.width; x += 10) {
    for (let y = 5; y < video.height; y += 10) {
      let c = video.get(x, y);
      suma += (c[0] + c[1] + c[2]) / 3;
      n++;
    }
}
if (n === 0) return 0;
return suma / n;
}
// -----------------------------------------
// P5
// -----------------------------------------

function setup() {
  createCanvas(400, 400);
  crearEnjambre();

  // NUEVO: new crea un objeto a partir del molde p5.AudioIn
  mic = new p5.AudioIn();
  mic.start();

  video = createCapture(VIDEO);
  video.size(80, 60);
  video.hide();
}

// El navegador no deja usar el sonido hasta que la persona hace clic.
function mousePressed() {
  userStartAudio();
  microActivo = true;
}

function draw() {
  background(245, 243, 235);

//Lerp se usa en senal para suavizar la señal, de manera que no cambie bruscamente de un valor a otro.
  let s = leerSenal();
  senal = lerp(senal, leerSenal(), 0.5);
  diametro = map(senal, 0, 1, 6, 40);
  

  for (let a of enjambre) {
    mover(a);
    aplicarBorde(a);
    mostrar(a, s);
  }

  textoMicro(s);
  textoCamara();
  image(video, 320, 0, 80, 60);
}
