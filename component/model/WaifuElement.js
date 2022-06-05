import { PersonajesService } from "../../service/PersonajesService.js";


export class WaifuElement extends HTMLElement {
    #timeout;
    #personajeSeleccionado;
    #arregloPersonajes;
    #paginacion;
    #promesaCargaWaifus;

    get personajeSeleccionado() {
        return this.#personajeSeleccionado;
    }

    static get #ELEMENT_WIDTH() {
        return 300;
    }

    constructor () {
        super();
        this.#timeout = null;
        this.#arregloPersonajes = [];

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

        buscador.addEventListener('keydown', e => {
            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
            }
        });

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



        buscador.addEventListener("focus", e => {
            if (buscador.value) {
                contenedorResultados.style.display = "";
            }
        });

        
        window.addEventListener("click", e => {
                if (e.target !== this && !document.querySelector("waifu-element").contains(e.target)) {
                    contenedorResultados.style.display = "none";
                }
        });

        this.appendChild(buscador);
        this.appendChild(contenedorResultados);

        contenedorResultados.addEventListener("scroll", e => {
            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
            }

            console.log(this.#promesaCargaWaifus);
            if (!this.#promesaCargaWaifus) {
                let scrollTop = contenedorResultados.scrollTop;
                let scrollHeight = contenedorResultados.scrollHeight; // added
                let offsetHeight = contenedorResultados.offsetHeight;
                // let clientHeight = contenedorResultados.clientHeight;
                let contentHeight = scrollHeight - offsetHeight; // added
                if (contentHeight <= scrollTop + 200) // modified
                {
                    // Now this is called when scroll end!
                    this.#promesaCargaWaifus = this.#cargarMasPersonajes(buscador.value).then(() => {
                        this.#promesaCargaWaifus = null;
                    });
                }
            }

            // this.#timeout = setTimeout(() => {
            //     let scrollTop = contenedorResultados.scrollTop;
            //     let scrollHeight = contenedorResultados.scrollHeight; // added
            //     let offsetHeight = contenedorResultados.offsetHeight;
            //     // let clientHeight = contenedorResultados.clientHeight;
            //     let contentHeight = scrollHeight - offsetHeight; // added
            //     if (contentHeight <= scrollTop + 200) // modified
            //     {
            //         // Now this is called when scroll end!
            //         this.#cargarMasPersonajes(buscador.value);
            //     }
            // }, 333);
            

        });

        this.addEventListener("keydown", e => {
            if (contenedorResultados && contenedorResultados.style.display != "none") {
                let tarjetaSeleccionada = contenedorResultados.querySelector(".seleccionado");
                if (tarjetaSeleccionada) {
                    let tarjetaSiguiente = null;
                    if (e.key === "ArrowDown") {//down
                        let indiceTarjeta = Number.parseInt(tarjetaSeleccionada.dataset.indice);
                        if (this.#arregloPersonajes.length >= indiceTarjeta + 2) {
                            tarjetaSeleccionada.classList.remove("seleccionado");
                            console.log(".waifutarjeta:nth-of-type(" + (indiceTarjeta + 2) + ")");
                            tarjetaSiguiente = contenedorResultados.querySelector(".waifutarjeta:nth-of-type(" + (indiceTarjeta + 2) + ")");
                            tarjetaSiguiente.classList.add("seleccionado");
                        }
                    }
                    if (e.key === "ArrowUp") {//up
                        let indiceTarjeta = Number.parseInt(tarjetaSeleccionada.dataset.indice);
                        if (indiceTarjeta > 0) {
                            tarjetaSeleccionada.classList.remove("seleccionado");
                            tarjetaSiguiente = contenedorResultados.querySelector(".waifutarjeta:nth-of-type(" + (indiceTarjeta) + ")");
                            tarjetaSiguiente.classList.add("seleccionado");
                        }
                    }
                    if (e.key === "Enter") {
                        buscador.value = "";
                        this.constructor.#limpiarElemento(contenedorResultados);
                        tarjetaSiguiente = null;
                    }
                    if (tarjetaSiguiente) {
                        tarjetaSiguiente.scrollIntoView({behavior: "smooth", block: "center"});
                    }
                }
            }
            
        });
    }

    static #limpiarElemento(elemento) {
        if (elemento && elemento.innerHTML) {
            elemento.innerHTML = "";
        }
    }
    
    #cambiarResultado(busqueda) {
        this.#promesaCargaWaifus = null;
        let contenedorResultados = document.getElementById("resultado");
        clearTimeout(this.#timeout);
        if (!busqueda) {
            this.#arregloPersonajes = [];
            this.constructor.#limpiarElemento(contenedorResultados);
            contenedorResultados.style.display = "none";
        } else {
            this.#timeout = setTimeout(() => {
                PersonajesService.buscarPersonaje({
                    nombre: busqueda
                }).then(johnson => {
                    this.#paginacion = johnson.pagination;

                    this.constructor.#limpiarElemento(contenedorResultados);
                    this.#personajeSeleccionado = null;
                    this.#arregloPersonajes = PersonajesService.formatearPersonajes(johnson);
                    let ind = 0;
                    for (const personaje of this.#arregloPersonajes) {
                        contenedorResultados.appendChild(this.#obtenerTarjeta(personaje, ind++));
                    }

                    let hasNextPage = this.#paginacion.has_next_page;
                    let currentPage = this.#paginacion.current_page;

                    if (hasNextPage) {
                        //TODO: implementar paginación
                        contenedorResultados.appendChild(this.#etiquetaCargando())


                    }

                    let primeraTarjeta = contenedorResultados.querySelector(".waifutarjeta:nth-of-type(1)");
                    if (primeraTarjeta) {
                        primeraTarjeta.classList.add("seleccionado");
                        this.#personajeSeleccionado = primeraTarjeta;
                    }
                    contenedorResultados.style.display = "";
                    contenedorResultados.scrollTo(0,0);
                });
            }, 333);
        }
    }

    #obtenerTarjeta(personaje, indice) {
        let colorDeFondoResaltado = "Turquoise";

        let tarjeta = document.createElement("div");
        tarjeta.style.width = "100%";
        tarjeta.style.height = "100px";
        tarjeta.style.display = "flex";
        tarjeta.style.flexDirection = "row";
        tarjeta.style.alignItems = "center";

        if (tarjeta.classList.contains("seleccionado")) {
            tarjeta.style.backgroundColor = colorDeFondoResaltado;
        } else {
            tarjeta.style.backgroundColor = "";
        }


        tarjeta.style.fontFamily = "Arial";

        tarjeta.dataset.id = personaje.id;
        tarjeta.dataset.indice = indice;

        tarjeta.classList.add("waifutarjeta");
        
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

        tarjeta.addEventListener("mouseover", e => {
                let tarjetaSeleccionada = document.querySelector(".waifutarjeta.seleccionado");
                if (tarjetaSeleccionada) {
                    tarjetaSeleccionada.classList.remove("seleccionado");
                }
                tarjeta.classList.add("seleccionado");
        });

        tarjeta.addEventListener("click", e => {
            e.stopPropagation();
            if(tarjeta.parentElement) {
                let padre = tarjeta.parentElement;
                if (padre.previousSibling) {
                    padre.previousSibling.value = "";
                }
                this.constructor.#limpiarElemento(padre);
            }
        });

        return tarjeta;
    }

    #etiquetaCargando() {
        let etiqueta = document.createElement("div");
        etiqueta.style.width = "100%";
        let icono = document.createElement("div");
        icono.classList.add("lds-spinner");
        icono.innerHTML = "<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>";
        etiqueta.style.display = "flex";
        etiqueta.style.justifyContent = "center";
        etiqueta.style.alignItems = "center";
        etiqueta.style.height = "100px";
        etiqueta.style.margin = "0";
        etiqueta.style.padding = "0";
        etiqueta.style.overflowY = "hidden";

        etiqueta.id = "waifucargando";

        etiqueta.appendChild(icono);

        return etiqueta;
    }

    #cargarMasPersonajes(nombre) {
        return new Promise((resolve, reject) => {

            try {
                let etiquetaCarga = document.getElementById("waifucargando");
                let listaWaifus = document.getElementById("resultado");
        
        
                let hasNextPage = this.#paginacion.has_next_page;
                let currentPage = this.#paginacion.current_page;
                let pagina = currentPage + 1;
                if (hasNextPage) {
                    PersonajesService.buscarPersonaje({
                        nombre: nombre,
                        pagina: pagina
                    }).then(nuevos => {
                        if (nuevos) {
                            this.#paginacion = nuevos.pagination;
                            let masWaifus = PersonajesService.formatearPersonajes(nuevos);
                            this.#arregloPersonajes = this.#arregloPersonajes.concat(masWaifus);
                            
                            let arregloElementosWaifu = document.querySelectorAll("#resultado > .waifutarjeta");
                            let ultimoElementoWaifu = arregloElementosWaifu[arregloElementosWaifu.length - 1];
        
                            let ultimoIndice = Number.parseInt(ultimoElementoWaifu.dataset.indice);
                            let indice = ultimoIndice + 1;
                            listaWaifus.removeChild(etiquetaCarga);
                            for (const waifu of masWaifus) {
                                let repetido = listaWaifus.querySelector(`.waifutarjeta[data-id='${waifu.id}']`);
                                if (!repetido) {
                                    listaWaifus.appendChild(this.#obtenerTarjeta(waifu, indice++));
                                }
                            }
            
                            if (nuevos.pagination.has_next_page) {
                                listaWaifus.appendChild(this.#etiquetaCargando());
                            }
                        }
                        resolve(true);
                    });
        
                }
            } catch (error) {
                reject(error);
            }

        });
    }

}