import { PersonajesService } from "../../service/PersonajesService.js";


export class WaifuElement extends HTMLElement {
    #timeout;

    static get #ELEMENT_WIDTH() {
        return 300;
    }

    constructor () {
        super();
        this.#timeout = null;

        this.style.width = this.constructor.#ELEMENT_WIDTH + "px";
        this.style.display = "flex";
        this.style.alignItems = "center";
        this.style.flexWrap = "wrap";

        let buscador = document.createElement("input");
        buscador.setAttribute("type", "text");
        buscador.setAttribute("placeholder", "Buscar waifu");
        buscador.addEventListener('input', e => this.#cambiarResultado(buscador.value));
        buscador.style.width = "100%";
        buscador.style.display = "block";
        buscador.style.margin = "0";
        buscador.style.padding = "0";
    

        let contenedorResultados = document.createElement("div");
        contenedorResultados.style.width = "100%";
        contenedorResultados.style.display = "flex";
        contenedorResultados.style.flexDirection = "column";
        contenedorResultados.style.flexWrap = "wrap";
        contenedorResultados.style.alignItems = "center";
        contenedorResultados.style.justifyContent = "center";
        contenedorResultados.style.margin = "0";
        contenedorResultados.style.padding = "0";


        let tablaResultado = document.createElement("table");
        tablaResultado.setAttribute("id", "resultado");
        document.getElementById("root").appendChild(buscador);
        document.getElementById("root").appendChild(tablaResultado);
        tablaResultado.style.border = "1px solid black";
        tablaResultado.style.borderTop = "none";
        tablaResultado.style.width = "100%";
        tablaResultado.style.display = "none";


        this.appendChild(buscador);
        this.appendChild(tablaResultado);
    }

    static #limpiarElemento(elemento) {
        if (elemento && elemento.innerHTML) {
            elemento.innerHTML = "";
        }
    }
    
    #cambiarResultado(busqueda) {
        let tablaResultado = document.getElementById("resultado");
        clearTimeout(this.#timeout);
        if (!busqueda) {
            this.constructor.#limpiarElemento(tablaResultado);
            tablaResultado.style.display = "none";
        } else {
            this.#timeout = setTimeout(() => {
                PersonajesService.buscarPersonaje(busqueda).then(johnson => {
                    this.constructor.#limpiarElemento(tablaResultado);
                    let arregloPersonajes = PersonajesService.formatearPersonajes(johnson);
                    for (const personaje of arregloPersonajes) {

                        // let fila = document.createElement("tr");
                        // let columnaImagen = document.createElement("td");
                        // let img = document.createElement("img");
                        // img.src = personaje.imagen;
                        // img.style.width = "100%";
                        // img.style.height = "100%";
                        // columnaImagen.appendChild(img);
                        // fila.appendChild(columnaImagen)
                        // let columnaNombre = document.createElement("td");
                        // columnaNombre.innerHTML = personaje.nombre;
                        // fila.appendChild(columnaNombre);
                        // tablaResultado.appendChild(fila);
                        // fila.addEventListener("mouseover", event => {
                        //     fila.style.backgroundColor = "cyan";
                        //     fila.style.borderColor = "cyan";
                        //     columnaImagen.style.backgroundColor = "cyan";
                        //     columnaImagen.style.borderColor = "cyan";
                        // });
                        // fila.addEventListener("mouseout", event => {
                        //     fila.style.backgroundColor = "";
                        //     fila.style.borderColor = "";
                        //     columnaImagen.style.backgroundColor = "";
                        //     columnaImagen.style.borderColor = "";
                        // });
                    }
                    tablaResultado.style.display = "";
                });
            }, 333);
        }
    }

    #construirTarjeta(personaje) {
        let tarjeta = document.createElement("div");
        tarjeta.style.width = "100%";
        tarjeta.style.display = "flex";
        tarjeta.style.flexDirection = "row";
        
        let contenedorImagen = document.createElement("div");
        contenedorImagen.style.margin = "0";
        contenedorImagen.style.padding = "0";
        contenedorImagen.style.width = "30%";
        contenedorImagen.style.display = "block";
        contenedorImagen.style.objectFit = "cover";
        contenedorImagen.style.backgroundImage = `url(${personaje.imagen})`;

        let contenedorNombre = document.createElement("div");
        
    }

}