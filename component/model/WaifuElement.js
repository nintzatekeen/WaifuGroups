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
        contenedorResultados.style.margin = "5px 0 0 0";
        contenedorResultados.style.padding = "0";
        contenedorResultados.style.display = "none";
        contenedorResultados.style.overflowY = "scroll";
        contenedorResultados.style.overflowX = "hidden";
        contenedorResultados.style.maxHeight = "50vh";
        contenedorResultados.style.scrollbarWidth = "thin";
        contenedorResultados.style.scrollbarColor = "MediumVioletRed transparent";
        contenedorResultados.style.backgroundColor = "white";
        contenedorResultados.style.borderRadius = "5px";
        contenedorResultados.id = "resultado";

        this.appendChild(buscador);
        this.appendChild(contenedorResultados);
    }

    static #limpiarElemento(elemento) {
        if (elemento && elemento.innerHTML) {
            elemento.innerHTML = "";
        }
    }
    
    #cambiarResultado(busqueda) {
        let contenedorResultados = document.getElementById("resultado");
        clearTimeout(this.#timeout);
        if (!busqueda) {
            this.constructor.#limpiarElemento(contenedorResultados);
            contenedorResultados.style.display = "none";
        } else {
            this.#timeout = setTimeout(() => {
                PersonajesService.buscarPersonaje(busqueda).then(johnson => {
                    this.constructor.#limpiarElemento(contenedorResultados);
                    let arregloPersonajes = PersonajesService.formatearPersonajes(johnson);
                    for (const personaje of arregloPersonajes) {
                        contenedorResultados.appendChild(this.#obtenerTarjeta(personaje));
                    }
                    contenedorResultados.style.display = "";
                });
            }, 333);
        }
    }

    #obtenerTarjeta(personaje) {

        let colorDeFondo = "white";
        let colorDeFondoResaltado = "Turquoise";

        let tarjeta = document.createElement("div");
        tarjeta.style.width = "100%";
        tarjeta.style.height = "100px";
        tarjeta.style.display = "flex";
        tarjeta.style.flexDirection = "row";
        tarjeta.style.alignItems = "center";


        tarjeta.style.fontFamily = "Arial";

        tarjeta.dataset.id = personaje.id;
        
        let contenedorImagen = document.createElement("div");
        contenedorImagen.style.margin = "0";
        contenedorImagen.style.padding = "0";
        contenedorImagen.style.width = "25%";
        contenedorImagen.style.height= "90%";
        contenedorImagen.style.display = "block";
        contenedorImagen.style.objectFit = "cover";
        contenedorImagen.style.backgroundImage = `url(${personaje.imagen})`;
        contenedorImagen.style.backgroundSize = "100% auto";
        contenedorImagen.style.backgroundRepeat = "no-repeat";
        contenedorImagen.style.borderRadius = "5px";
        contenedorImagen.style.marginLeft = "calc(25%*0.05)";
        
        let contenedorNombre = document.createElement("div");
        contenedorNombre.style.margin = "0";
        contenedorNombre.style.padding = "0";
        contenedorNombre.style.width = "75%";
        contenedorNombre.style.display = "flex";
        contenedorNombre.style.alignItems = "center";
        contenedorNombre.style.justifyContent = "initial";
        contenedorNombre.style.textIndent = "1em";

        contenedorNombre.innerHTML = personaje.nombre;

        tarjeta.appendChild(contenedorImagen);
        tarjeta.appendChild(contenedorNombre);

        tarjeta.addEventListener("mouseover", event => {
            tarjeta.style.backgroundColor = colorDeFondoResaltado;
            tarjeta.style.borderRadius = "5px";
        });

        tarjeta.addEventListener("mouseout", event => {
            tarjeta.style.backgroundColor = "";
            tarjeta.style.borderRadius = "";
        });

        return tarjeta;
    }

}