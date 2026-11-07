// Unidad 3 · Clase 4 · La fuente — patrón MUCHOS REGISTROS
// Cada sismo de la última semana es un agente del enjambre.
// datos.js se carga antes que este archivo (ver index.html) y entrega:
//   cargarDatos(direccion, minutos), la variable datos y segundosSinDatos().

let enjambre = [];
let limiteVelocidad = 1;

// Sismos de magnitud 4.5 o más de los últimos 7 días, del USGS (gratuito, sin clave).
let direccion =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";
// Sin internet, usa la copia del proyecto:
// let direccion = "respaldo/sismos.json";

// -----------------------------------------
// DE LOS DATOS AL ENJAMBRE
// Cada elemento de datos.features es un sismo:
//   f.properties.mag            la magnitud
//   f.properties.place          dónde fue (texto)
//   f.geometry.coordinates[2]   la profundidad, en km
// -----------------------------------------

function crearDesdeDatos() {
  for (let f of datos.features) {
    //Para que cada sismo tenga su posición real en el mapa, se crean las variables longitud y latitud
    //para "x" e "y", y se usa la función map() para que se ajusten a el canvas.
    let longitud = f.geometry.coordinates[0];
    let latitud = f.geometry.coordinates[1];

    enjambre.push({
      x: map(longitud, -180, 180, 10, width - 10),
      y: map(latitud, 90, -90, 30, height - 10),
      vx: random(-limiteVelocidad, limiteVelocidad),
      vy: random(-limiteVelocidad, limiteVelocidad),
      mag: f.properties.mag,
      prof: f.geometry.coordinates[2],
    });
    //El siguiente if permite que los sismos de magnitud menor a 5 no se muestren en el enjambre,
    // ya que se eliminan del arreglo con pop().
    if (f.properties.mag < 5) {
      enjambre.pop();
    }
  }
}

function mover(a) {
  a.x += 0;
  a.y += 0;
}

function aplicarBorde(a) {
  if (a.x < 10 || a.x > width - 10) a.vx *= -1;
  if (a.y < 30 || a.y > height - 10) a.vy *= -1;
}

// La magnitud decide el tamaño; la profundidad, el color.
function mostrar(a) {
  let d = map(a.mag, 4.5, 7, 8, 40);
  let t = map(a.prof, 0, 700, 0, 1);
  noStroke();
  fill(lerpColor(color(255, 34, 93), color(46, 255, 230), t));
  circle(a.x, a.y, d);
}

// -----------------------------------------
// P5
// -----------------------------------------

function setup() {
  createCanvas(400, 400);

  // NUEVO: pide los datos ahora y después cada 30 minutos
  cargarDatos(direccion, 30);
}

function draw() {
  background(245, 243, 235);

  // El enjambre se crea una sola vez, cuando llegan los datos.
  if (enjambre.length === 0 && datos !== null) {
    crearDesdeDatos();
  }

  for (let a of enjambre) {
    mover(a);
    aplicarBorde(a);
    mostrar(a);
  }

  fill(20);
  noStroke();
  if (datos === null) {
    text("esperando datos…", 10, 20);
  } else {
    text(enjambre.length + " sismos en los últimos 7 días", 10, 20);
  }
}
