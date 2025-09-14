const contenedorJuego = document.getElementById("serpiente"); 
const tamano = 10; 

let serpiente = [{x: 0, y: 0}]; 
let puntuacion = 0;

let comida = generarPosicionComida(); 

function generarPosicionComida() { 
    const maximoX = Math.floor((contenedorJuego.offsetWidth - tamano) / tamano);
    const maximoY = Math.floor((contenedorJuego.offsetWidth - tamano) / tamano);

    let comidaX, comidaY;
    do { 
        comidaX = Math.floor(Math.random() * maximoX) * tamano, 
        comidaY = Math.floor(Math.random() * maximoY) * tamano
    } while (serpiente.some(segmento => segmento.x === comidaX && segmento.y === comidaY));
    return {x: comidaX, y: comidaY};
} 

function dibujar() { 
    contenedorJuego.innerHTML = ''; 
    serpiente.forEach((segmento, index) => { 
        const serpientePartes = document.createElement('div'); 
        serpientePartes.id = `segmento-${index}`;
        serpientePartes.style.width = tamano + 'px'; 
        serpientePartes.style.height = tamano + 'px'; 
        serpientePartes.style.backgroundColor = 'green'; 
        serpientePartes.style.position = 'absolute'; 
        serpientePartes.style.left = segmento.x + 'px'; 
        serpientePartes.style.top = segmento.y + 'px'; 
        serpientePartes.style.borderRadius = '50%';
        serpientePartes.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.3)';
        
        contenedorJuego.appendChild(serpientePartes); 
    }); 

    const cabezaElemento = document.createElement('div');
    cabezaElemento.style.width = tamano + 'px'; 
    cabezaElemento.style.height = tamano + 'px'; 
    cabezaElemento.style.backgroundColor = 'darkgreen'; 
    cabezaElemento.style.position = 'absolute'; 
    cabezaElemento.style.left = serpiente[0].x + 'px'; 
    cabezaElemento.style.top = serpiente[0].y + 'px';
    cabezaElemento.style.borderRadius = '50%';
    cabezaElemento.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.3)';
    
    const ojoIzquierdo = document.createElement('div');
    ojoIzquierdo.style.width = '1px';
    ojoIzquierdo.style.height = '1px';
    ojoIzquierdo.style.backgroundColor = '#fff';
    ojoIzquierdo.style.borderRadius = '50%';
    ojoIzquierdo.style.position = 'absolute';
    ojoIzquierdo.style.top = '20%';
    ojoIzquierdo.style.left = '30%';
    
    const ojoDerecho = document.createElement('div');
    ojoDerecho.style.width = '1px';
    ojoDerecho.style.height = '1px';
    ojoDerecho.style.backgroundColor = '#fff';
    ojoDerecho.style.borderRadius = '50%';
    ojoDerecho.style.position = 'absolute';
    ojoDerecho.style.top = '20%';
    ojoDerecho.style.left = '60%';

    cabezaElemento.appendChild(ojoIzquierdo);
    cabezaElemento.appendChild(ojoDerecho);
    contenedorJuego.appendChild(cabezaElemento);
    
    const colaElemento = document.createElement('div');
    colaElemento.style.width = tamano + 'px'; 
    colaElemento.style.height = tamano + 'px'; 
    colaElemento.style.backgroundColor = 'darkgreen'; 
    colaElemento.style.position = 'absolute'; 
    colaElemento.style.left = serpiente[serpiente.length - 1].x + 'px'; 
    colaElemento.style.top = serpiente[serpiente.length - 1].y + 'px';
    colaElemento.style.borderRadius = '50%';
    colaElemento.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.3)';
    
    contenedorJuego.appendChild(colaElemento);
        
    const comidaElemento = document.createElement('div'); 
    comidaElemento.style.width = tamano + 'px'; 
    comidaElemento.style.height = tamano + 'px'; 
    comidaElemento.style.borderRadius = tamano + 'px'; 
    comidaElemento.style.backgroundColor = 'red'; 
    comidaElemento.style.position = 'absolute'; 
    comidaElemento.style.left = comida.x + 'px'; 
    comidaElemento.style.top = comida.y + 'px'; 
    
    contenedorJuego.appendChild(comidaElemento); 
} 

function moverSerpiente() { 
    const cabeza = {x: serpiente[0].x, y: serpiente[0].y}; 

    switch (direccion) {
        case "Up":
            cabeza.y -= tamano;
            break;
        case "Down":
            cabeza.y += tamano;
            break;
        case "Left":
            cabeza.x -= tamano;
            break;
        case "Right":
            cabeza.x += tamano;
            break;
    }

    if (ganar()) {
        alert("Has ganado!");
        reiniciar();
    }
    
    if (colision(cabeza) || cabeza.x < 0 || cabeza.x >= contenedorJuego.offsetWidth - tamano || cabeza.y < 0 || cabeza.y >= contenedorJuego.offsetHeight - tamano) { 
        alert("Has perdido!");
        reiniciar();
        return;
    } 
    
    if (cabeza.x === comida.x && cabeza.y === comida.y) { 
        comida = generarPosicionComida(); 
        puntuacion += tamano;
        document.getElementById("puntuacion").innerText = "SCORE: " + puntuacion;

        const crecerIntervalo = setInterval(() => {
            if (serpiente.length * tamano < puntuacion) {
                serpiente.unshift({x: cabeza.x, y: cabeza.y});
            } else {
                clearInterval(crecerIntervalo)
            }
        }, 50);
    } else { 
        serpiente.pop(); 
    } 
    serpiente.unshift(cabeza); 
    animarMovimiento();
} 

function animarMovimiento() {
    let i = 0;
    const animarIntervalo = setInterval(() => {
        if (i < serpiente.length) {
            const segmento = serpiente[i];
            const serpienteParte = document.querySelector(`#segmento-${i}`);
            serpienteParte.style.transition = "left 0.2s, top 0.2s";
            serpienteParte.style.left = segmento.x + "px";
            serpienteParte.style.top = segmento.y + "px";
            i++; 
        } else {
            clearInterval(animarIntervalo);
        }
    }, 50);
}

let direccion = "Right";
let contadorPulsacion = 0;
let velocidad = 500;
let intervalo;

document.addEventListener('keydown', event => { 
    const key = event.key; 
    if ((key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight") && contadorPulsacion < 2) {

        if (key === "ArrowUp" && direccion !== "Down") { 
            direccion = "Up";
        } else if (key === "ArrowDown" && direccion !== "Up") { 
            direccion = "Down";
        } else if (key === "ArrowLeft" && direccion !== "Right") { 
            direccion = "Left";
        } else if (key === "ArrowRight" && direccion !== "Left") { 
            direccion = "Right";
        }
        
        contadorPulsacion++;
        if (contadorPulsacion === 2) {
            velocidad = 200;
            clearInterval(intervalo);
            intervalo = setInterval(() => {
                moverSerpiente();
                dibujar();
            }, velocidad);
        } else {
            velocidad = 500;
        }
    }
});

document.addEventListener('keyup', event => {
    contadorPulsacion = 0;
    velocidad = 500;

    clearInterval(intervalo);
    intervalo = setInterval(() => {
        moverSerpiente();
        dibujar();
    }, velocidad);
});

function colision(cabeza) {
    for (let i = 1; i < serpiente.length; i++) {
        if (cabeza.x === serpiente[i].x && cabeza.y === serpiente[i].y) {
            return true;
        }
    }
    return false;
}

function reiniciar() {
    serpiente = [{x: 0, y: 0}];
    comida = generarPosicionComida();
    direccion = "Right";
}

function ganar() {
    const totalSegmentos = Math.floor((contenedorJuego.offsetWidth * contenedorJuego.offsetHeight) / (tamano * tamano));
    return serpiente.length === totalSegmentos;
}

document.getElementById("arriba").addEventListener('click', function() {
    direccion = "Up";
});

document.getElementById("derecha").addEventListener('click', function() {
    direccion = "Right";
});

document.getElementById("abajo").addEventListener('click', function() {
    direccion = "Down";
});

document.getElementById("izquierda").addEventListener('click', function() {
    direccion = "Left";
});

document.getElementById("iniciar").addEventListener('click', function() {
    intervalo = setInterval(() => { 
        moverSerpiente();
        dibujar(); 
    }, velocidad);
});  