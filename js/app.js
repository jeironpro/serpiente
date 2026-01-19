const contenedorJuego = document.getElementById("tablero-juego");
const tamanoSegmento = 20;

let cuerpoSerpiente = [{ x: 0, y: 0 }];
let puntuacion = 0;
let direccion = "Derecha";
let velocidad = 150;
let intervaloJuego;

const generarPosicionComida = () => {
    const maximoX = Math.floor((contenedorJuego.clientWidth - tamanoSegmento) / tamanoSegmento);
    const maximoY = Math.floor((contenedorJuego.clientHeight - tamanoSegmento) / tamanoSegmento);

    let comidaX, comidaY;
    do {
        comidaX = Math.floor(Math.random() * maximoX) * tamanoSegmento;
        comidaY = Math.floor(Math.random() * maximoY) * tamanoSegmento;
    } while (cuerpoSerpiente.some(segmento => segmento.x === comidaX && segmento.y === comidaY));

    return { x: comidaX, y: comidaY };
};

const limpiarTablero = () => {
    const elementos = contenedorJuego.querySelectorAll('.segmento-serpiente, .cabeza-serpiente, .comida');
    elementos.forEach(el => el.remove());
};

const crearOjo = (posicion) => {
    const ojo = document.createElement('div');
    ojo.className = 'ojo';
    ojo.style.top = '25%';
    if (posicion === 'izq') {
        ojo.style.left = '25%';
    } else {
        ojo.style.right = '25%';
    }
    return ojo;
};

const dibujar = () => {
    limpiarTablero();

    cuerpoSerpiente.forEach((segmento, indice) => {
        if (indice === 0) return;
        const parte = document.createElement('div');
        parte.className = 'segmento-serpiente';
        parte.style.left = segmento.x + 'px';
        parte.style.top = segmento.y + 'px';
        parte.style.opacity = 1 - (indice / cuerpoSerpiente.length) * 0.5;
        contenedorJuego.appendChild(parte);
    });

    const cabeza = document.createElement('div');
    cabeza.className = 'cabeza-serpiente';
    cabeza.style.left = cuerpoSerpiente[0].x + 'px';
    cabeza.style.top = cuerpoSerpiente[0].y + 'px';
    cabeza.appendChild(crearOjo('izq'));
    cabeza.appendChild(crearOjo('der'));
    contenedorJuego.appendChild(cabeza);

    const comidaElemento = document.createElement('div');
    comidaElemento.className = 'comida';
    comidaElemento.style.left = (comida.x + 2) + 'px';
    comidaElemento.style.top = (comida.y + 2) + 'px';
};

const comida = generarPosicionComida();

const mostrarFinJuego = (victoria) => {
    clearInterval(intervaloJuego);
    mensajeFinal.textContent = victoria ? "¡HAS GANADO!" : "¡FIN DEL JUEGO!";
    mensajeFinal.style.color = victoria ? "var(--color-acento)" : "var(--color-alerta)";
    puntosFinales.textContent = "PUNTOS: " + puntuacion;
    pantallaFinal.className = "pantalla-final";
};

const verificarVictoria = () => {
    const totalCeldas = (contenedorJuego.clientWidth * contenedorJuego.clientHeight) / (tamanoSegmento * tamanoSegmento);
    return cuerpoSerpiente.length === totalCeldas;
};

const moverSerpiente = () => {
    const nuevaCabeza = { x: cuerpoSerpiente[0].x, y: cuerpoSerpiente[0].y };

    switch (direccion) {
        case "Arriba": nuevaCabeza.y -= tamanoSegmento; break;
        case "Abajo": nuevaCabeza.y += tamanoSegmento; break;
        case "Izquierda": nuevaCabeza.x -= tamanoSegmento; break;
        case "Derecha": nuevaCabeza.x += tamanoSegmento; break;
    }

    const colisionCuerpo = cuerpoSerpiente.some((segmento, indice) => indice !== 0 && segmento.x === nuevaCabeza.x && segmento.y === nuevaCabeza.y);
    const fueraLimites = nuevaCabeza.x < 0 || nuevaCabeza.x >= contenedorJuego.clientWidth || nuevaCabeza.y < 0 || nuevaCabeza.y >= contenedorJuego.clientHeight;

    if (colisionCuerpo || fueraLimites) {
        mostrarFinJuego(false);
        return;
    }

    if (nuevaCabeza.x === comida.x && nuevaCabeza.y === comida.y) {
        puntuacion += 10;
        document.getElementById("puntuacion-actual").textContent = "PUNTOS: " + puntuacion;
        comida = generarPosicionComida();
    } else {
        cuerpoSerpiente.pop();
    }

    cuerpoSerpiente.unshift(nuevaCabeza);

    if (verificarVictoria()) {
        mostrarFinJuego(true);
    }
};

const cambiarDireccion = (nuevaDireccion) => {
    const direccionesOpuestas = {
        "Arriba": "Abajo",
        "Abajo": "Arriba",
        "Izquierda": "Derecha",
        "Derecha": "Izquierda"
    };
    if (nuevaDireccion !== direccionesOpuestas[direccion]) {
        direccion = nuevaDireccion;
    }
};

const reiniciarJuego = () => {
    clearInterval(intervaloJuego);
    cuerpoSerpiente = [{ x: 0, y: 0 }];
    puntuacion = 0;
    direccion = "Derecha";
    comida = generarPosicionComida();
    document.getElementById("puntuacion-actual").textContent = "PUNTOS: 0";
    document.getElementById("boton-inicio").style.display = "flex";
    pantallaFinal.className = "pantalla-oculta";
    limpiarTablero();
    dibujar();
};

const iniciarJuego = () => {
    document.getElementById("boton-inicio").style.display = "none";
    pantallaFinal.className = "pantalla-oculta";
    if (intervaloJuego) clearInterval(intervaloJuego);
    intervaloJuego = setInterval(() => {
        moverSerpiente();
        dibujar();
    }, velocidad);
};

document.addEventListener('keydown', event => {
    switch (event.key) {
        case "ArrowUp": cambiarDireccion("Arriba"); break;
        case "ArrowDown": cambiarDireccion("Abajo"); break;
        case "ArrowLeft": cambiarDireccion("Izquierda"); break;
        case "ArrowRight": cambiarDireccion("Derecha"); break;
    }
});

document.getElementById("ctrl-arriba").addEventListener('click', () => cambiarDireccion("Arriba"));
document.getElementById("ctrl-abajo").addEventListener('click', () => cambiarDireccion("Abajo"));
document.getElementById("ctrl-izquierda").addEventListener('click', () => cambiarDireccion("Izquierda"));
document.getElementById("ctrl-derecha").addEventListener('click', () => cambiarDireccion("Derecha"));

document.getElementById("boton-inicio").addEventListener('click', iniciarJuego);
botonReiniciar.addEventListener('click', reiniciarJuego);

dibujar();
