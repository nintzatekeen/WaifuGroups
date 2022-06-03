export class Personaje {
    #id;
    #nombre;
    #imagen;
    constructor(datos) {
        if (datos) {
            if (datos.images && datos.images.jpg && datos.images.jpg.image_url) {
                this.#imagen = datos.images.jpg.image_url;
            }
            if (datos.name) {
                this.#nombre = datos.name;
            }
            if (datos.mal_id) {
                this.#id = datos.mal_id;
            }
        }
    }

    get id() {
        return this.#id;
    }

    get nombre() {
        return this.#nombre;
    }
    
    get imagen() {
        return this.#imagen;
    }
}