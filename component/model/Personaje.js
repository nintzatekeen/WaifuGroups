export class Personaje {
    nombre;
    imagen;
    constructor(datos) {
        if (datos) {
            if (datos.images && datos.images.jpg && datos.images.jpg.image_url) {
                this.imagen = datos.images.jpg.image_url;
            }
            if (datos.name) {
                this.nombre = datos.name;
            }
        }
    }
    
}