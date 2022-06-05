import { RequestService } from "./RequestService.js";
import { Personaje } from "../component/model/Personaje.js";

export class PersonajesService {
    static async buscarPersonaje(parametros) {
        if (!parametros) {
            return [];
        }
        let johnson = await RequestService.GET("https://api.jikan.moe/v4/characters", 
        {q: parametros.nombre ? parametros.nombre : "",
        order_by: "favorites",
        sort: "desc",
        page: parametros.pagina ? parametros.pagina : 1});
        return johnson;
    }
    
    static formatearPersonajes(jsonRespuesta) {
        let arregloPersonajes = [];
        if (jsonRespuesta) {
            let datos = jsonRespuesta.data;
            if (datos) {
                for (const personajeCompleto of datos) {
                    arregloPersonajes.push(new Personaje(personajeCompleto));
                }
            }
        }
        return arregloPersonajes;
    }

}