import {PersonajesService} from "../service/PersonajesService.js";
import {WaifuElement} from "../component/model/WaifuElement.js";

if(!window.customElements.get('waifu-element')) {
    window.customElements.define("waifu-element", WaifuElement);
}

let NUM_IMAGENES = 2;
const ALTURA = 150;

let height;
let width;

let imagenes;

let timeout = null;

let getDataUrl = (blob => new Promise((resolve, reject) => {
    var a = new FileReader();
    a.onload = function (e) { resolve(e.target.result); }
    a.onerror = err => reject(err);
    a.readAsDataURL(blob);
}));

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function ordenArrayAleatorio(arr) {
    let arrConsumible = [...arr];
    let arrOrdenado = new Array();
    while (arrConsumible.length > 0) {
        let aleatorio = getRandomInt(0, arrConsumible.length);
        arrOrdenado.push(arrConsumible.splice(aleatorio, 1)[0]);
    }
    return arrOrdenado;
}

async function blobToDataURL(blob) {
    let ret = null;
    await getDataUrl(blob).then(wea => ret = wea);
    return ret;
}

function getCanvas(imgs) {
    let canvas = document.createElement("canvas");
    //canvas.height = ALTURA;
    canvas.height = height;
    //let anchura = ALTURA * (2/3);
    //canvas.width = anchura * NUM_IMAGENES;
    canvas.width = width;
    let anchuraUnitaria = width / 3;
    let ctx = canvas.getContext("2d");
    let count = 0;
    imgs.forEach(imagen => {
        ctx.drawImage(imagen, count++ * anchuraUnitaria, 0, anchuraUnitaria, height);
    });
    return canvas;
}

function insertBlobToZip(canvas, zip, numerodeimagen) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(imgBlob => {
            zip.file(`imagen${numerodeimagen}.png`, imgBlob);
            resolve();
        });
    });
}

function getImage(src) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = (e => resolve(img));
        img.onerror = (err => reject(err));
        img.src = src;
    });
}

function limpiarElemento(elemento) {
    if (elemento && elemento.innerHTML) {
        elemento.innerHTML = "";
    }
}

function cambiarResultado(busqueda) {
    let tablaResultado = document.getElementById("resultado");
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        PersonajesService.buscarPersonaje(busqueda).then(johnson => {
            limpiarElemento(tablaResultado);
            let arregloPersonajes = PersonajesService.formatearPersonajes(johnson);
            for (const personaje of arregloPersonajes) {
                let fila = document.createElement("tr");
                let columnaImagen = document.createElement("td");
                let img = document.createElement("img");
                img.src = personaje.imagen;
                columnaImagen.appendChild(img);
                fila.appendChild(columnaImagen)
                let columnaNombre = document.createElement("td");
                columnaNombre.innerHTML = personaje.nombre;
                fila.appendChild(columnaNombre);
                tablaResultado.appendChild(fila);
            }
        });
    }, 333);
}

window.onload = () => {
    let waifuElement = new WaifuElement();
    waifuElement.alSeleccionar(console.log);
    document.getElementById("root").appendChild(waifuElement);

    /*document.getElementById("formulario").addEventListener("submit", async (e) => {
        e.preventDefault();
        width = Number.parseInt(document.getElementById("ancho").value);
        height = Number.parseInt(document.getElementById("alto").value);

        NUM_IMAGENES = Number.parseInt(document.getElementById("numerodewaifus").value);

        imagenes = new Array();
        let zip = new JSZip();
        let files = document.getElementById("inp").files;
        if (files.length < NUM_IMAGENES) {
            alert("No ha introducido suficientes weas")
        } else {
            for await (f of files) {
                let chingadera = await blobToDataURL(f);
                let img = await getImage(chingadera);
                imagenes.push(img)
            }

            imagenes = ordenArrayAleatorio(imagenes);

            let numerodeimagen = 1;

            let promises = new Array();

            while (imagenes.length / NUM_IMAGENES >= 1) {
                let selec = new Array();
                for (let i = 0; i < NUM_IMAGENES; i++) {
                    selec.push(imagenes[0]);
                    imagenes.shift();
                }
                console.log(selec.length);
                let canvas = getCanvas(selec);
                promises.push(insertBlobToZip(canvas, zip, numerodeimagen++));

            }
            Promise.all(promises).then(values => {
                zip.generateAsync({ type: "blob" })
                    .then(function (blob) {
                        saveAs(blob, "imagenes.zip");
                    })
            });
        }


    })*/
}