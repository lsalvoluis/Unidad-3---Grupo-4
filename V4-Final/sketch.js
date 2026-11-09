// ==========================================
// CÓDIGO BASE ORIGINAL (Unidad 3 · Clase 2 · El oído)
// ==========================================
let enjambre = [], cantidad = 40, diametro = 14, limiteVelocidad = 2;
//Fuentes disponibles: "micro", "mouse", "ruido", "camara", "bitcoin"
let fuente = "bitcoin";
let mic, microActivo = false, video, camActiva = false, senal = 0;

// ==========================================
// APORTE DE MAXI: Integración de datos de Bitcoin vía JSON
// ==========================================
let datosBitcoin = [], bitcoinPeriodos = [], agentesBitcoin = [], variacionBitcoinMax = 0, imagenBitcoin;

//cargarBitcoin fue creada con inteligencia artificial para leer un archivo JSON con datos históricos de Bitcoin y
//procesarlos para crear periodos de variación. Luego, sincroniza estos periodos con los agentes visuales en el lienzo
async function cargarBitcoin() {
try {
const respuesta = await fetch("bitcoin.json");
if (!respuesta.ok) throw new Error("Error al cargar Bitcoin");

const datos = await respuesta.json();
datosBitcoin = datos.serie;
console.log("Primer registro:", datosBitcoin[0]);
console.log("Último registro:", datosBitcoin[datosBitcoin.length - 1]);
console.log("Cantidad de registros:", datosBitcoin.length);

bitcoinPeriodos = construirPeriodosBitcoin(datosBitcoin);
sincronizarAgentesBitcoin(bitcoinPeriodos);
} catch (error) {
console.error(error);
}
}

//sincronizarAgentesBitcoin toma los periodos de variación de Bitcoin y los asigna a los agentes,
//ajustando su posición y velocidad según la magnitud de la variación
function sincronizarAgentesBitcoin(periodos) {
variacionBitcoinMax = Math.max(0, ...periodos.map(p => Math.abs(p.variacion)));

agentesBitcoin = periodos.map((periodo, i) => {
let agente = agentesBitcoin[i];
if (agente) { agente.periodo = periodo; return agente; }
let ancho = width || 400, alto = height || 400;
return { periodo, x: random(20, ancho - 20), y: random(20, alto - 20), vx: random(-1, 1), vy: random(-1, 1) };
});
}

cargarBitcoin();

//registroMasCercano encuentra el registro más cercano a una fecha objetivo dentro de una serie de datos
function registroMasCercano(serie, fechaObjetivo) {
let mejor = serie[0], menorDistancia = 999999999;
for (let i = 0; i < serie.length; i++) {
let distancia = Math.abs(new Date(serie[i].fecha) - fechaObjetivo);
if (distancia < menorDistancia) { menorDistancia = distancia; mejor = serie[i]; }
}
return mejor;
}
//construirPeriodosBitcoin genera periodos de variación de Bitcoin a partir de la serie de datos,calculando la variación 
// porcentual entre registros separados por un año y agrupándolos en intervalos de seis meses
function construirPeriodosBitcoin(serie) {
let inicio = new Date(serie[serie.length - 1].fecha), final = new Date(serie[0].fecha), periodos = [];
inicio.setFullYear(inicio.getFullYear() + 1);

for (let fecha = new Date(inicio); fecha <= final; fecha.setMonth(fecha.getMonth() + 6)) {
let actual = registroMasCercano(serie, fecha), fechaAnterior = new Date(fecha);
fechaAnterior.setFullYear(fechaAnterior.getFullYear() - 1);
let anterior = registroMasCercano(serie, fechaAnterior);

let variacion = ((actual.valor - anterior.valor) / anterior.valor) * 100;
periodos.push({ fecha: actual.fecha, valor: actual.valor, valorAnterior: anterior.valor, variacion: variacion });
}
return periodos;
}

// ==========================================
// CÓDIGO BASE: Lectura de señales y enjambre
// ==========================================
function leerSenal() {
if (fuente === "micro" && mic) return map(mic.getLevel(), 0, 0.2, 0, 1);
if (fuente === "mouse") return constrain(mouseX / width, 0, 1);
if (fuente === "ruido") return noise(frameCount * 0.01);
if (fuente === "camara" && video) return brilloPromedio() / 255;
return 0;
}

function crearEnjambre() {
for (let i = 0; i < cantidad; i++) {
enjambre.push({ x: random(diametro, width - diametro), y: random(diametro, height - diametro), vx: random(-limiteVelocidad, limiteVelocidad), vy: random(-limiteVelocidad, limiteVelocidad) });
}
}

function mover(a) { a.x += a.vx; a.y += a.vy; }

function aplicarBorde(a) {
if (a.x < diametro / 2 || a.x > width - diametro / 2) { a.vx *= -1; a.x = constrain(a.x, diametro / 2, width - diametro / 2); }
if (a.y < diametro / 2 || a.y > height - diametro / 2) { a.vy *= -1; a.y = constrain(a.y, diametro / 2, height - diametro / 2); }
}

// ==========================================
// APORTE DE MAXI: Movimiento y renderizado de agentes Bitcoin
// ==========================================
function moverAgenteBitcoin(a) {
let nivelVariacion = variacionBitcoinMax === 0 ? 0 : constrain(Math.abs(a.periodo.variacion) / variacionBitcoinMax, 0, 1);
let giroTono = a.periodo.variacion > 0 ? 90 : (a.periodo.variacion < 0 ? -30 : 0);
let tamano = map(nivelVariacion, 0, 1, 8, 36);
let velocidad = map(nivelVariacion, 0, 1, 0.5, 3);
let magnitud = Math.hypot(a.vx, a.vy) || 1;

a.vx = (a.vx / magnitud) * velocidad;
a.vy = (a.vy / magnitud) * velocidad;
a.x += a.vx; a.y += a.vy;

if (a.x < tamano / 2 || a.x > width - tamano / 2) {
a.vx *= -1;
a.x = constrain(a.x, tamano / 2, width - tamano / 2);
}
if (a.y < tamano / 2 || a.y > height - tamano / 2) {
a.vy *= -1;
a.y = constrain(a.y, tamano / 2, height - tamano / 2);
}

drawingContext.filter = `hue-rotate(${giroTono}deg)`;
if (imagenBitcoin) image(imagenBitcoin, a.x - tamano / 2, a.y - tamano / 2, tamano, tamano);
drawingContext.filter = "none";
}

function mostrar(a, s) {
noStroke();
s > 0.9 ? (fill(255, 0, 0), square(a.x, a.y, diametro)) : (fill(46, 196, 230), circle(a.x, a.y, diametro));
if (video) fill(video.get(map(a.x, 0, width, 0, video.width), map(a.y, 0, height, 0, video.height)));
}

function textoMicro(s){
fill(220); noStroke();
fuente === "micro" && !microActivo ? text("haz clic en el lienzo para activar el micrófono", 10, 20) : text("señal: " + round(s * 100) + " %", 10, 20);
if (mic && typeof mic.getLevel === 'function') text(nf(mic.getLevel(), 1, 3), 10, 40);

if(fuente === "micro") {
textSize(18);
fill(microActivo ? [0, 255, 0] : [255, 0, 0]);
text(microActivo ? "Micrófono activo" : "Micrófono inactivo", 10, 60);
}
}

function textoCamara() {
fill(220); noStroke();
if(fuente === "camara") {
text("Cámara activa", 10, 60);
text("Brillo promedio: " + round(brilloPromedio()), 10, 80);
}
}

function brilloPromedio() {
if (!video) return 0;
let suma = 0, n = 0;
for (let x = 5; x < video.width; x += 10) {
for (let y = 5; y < video.height; y += 10) {
let c = video.get(x, y); suma += (c[0] + c[1] + c[2]) / 3; n++;
}
}
return n === 0 ? 0 : suma / n;
}

// ==========================================
// CÓDIGO BASE Y CONFIGURACIÓN P5.JS (2.0)
// ==========================================
async function setup() {
createCanvas(400, 400);
crearEnjambre();

// Aporte de Maxi: Carga asíncrona adaptada a p5.js 2.0
imagenBitcoin = await loadImage("Bitcoin.jpg");

if (typeof p5.AudioIn === 'function') {
mic = new p5.AudioIn();
mic.start();
}

video = createCapture(VIDEO);
video.size(80, 60);
video.hide();
}

function mousePressed() {
if (typeof userStartAudio === 'function') userStartAudio();
microActivo = true;
}

function draw() {
// Aporte de Maxi: Fondo oscuro y condensación de lógica de dibujo
background(15, 25, 45);

let s = leerSenal();
senal = lerp(senal, leerSenal(), 0.5);
diametro = map(senal, 0, 1, 6, 40);

if (fuente === "bitcoin") {
for (let agente of agentesBitcoin) { moverAgenteBitcoin(agente); }
} else {
for (let a of enjambre) { mover(a); aplicarBorde(a); mostrar(a, s); }
}

textoMicro(s);
textoCamara();
if (video) image(video, 320, 0, 80, 60);

// ==========================================
// APORTE DE MAXI: Decoración HUD y UI visual
// ==========================================
noFill(); stroke(46, 196, 230, 120); strokeWeight(3);
rect(4, 4, width - 8, height - 8, 8);
fill(220); noStroke(); textSize(10); textStyle(BOLD);
text(">> SISTEMA ACTIVO | FUENTE: " + fuente.toUpperCase() + " | SEÑAL: " + nf(senal, 1, 2), 12, 18);
textStyle(NORMAL);
}