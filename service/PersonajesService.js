import { RequestService } from "./RequestService.js";
import { Personaje } from "../component/model/Personaje.js";

export class PersonajesService {
    static async buscarPersonaje(nombre) {
        let johnson = await RequestService.GET("https://api.jikan.moe/v4/characters", 
        {q: nombre,
        order_by: "favorites",
        sort: "desc"});
        return johnson;
    }
    
    static formatearPersonajes(jsonRespuesta) {
        let arregloPersonajes = [];
        if (jsonRespuesta) {
            let datos = jsonRespuesta.data;
            if (datos) {
                for (const personajeCompleto of datos) {
                    console.log(personajeCompleto);
                    arregloPersonajes.push(new Personaje(personajeCompleto));
                }
            }
        }
        return arregloPersonajes;
    }

}