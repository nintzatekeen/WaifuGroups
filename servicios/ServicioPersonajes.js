export class ServicioPersonajes {
    static async GET(url, params) {
            let urlObj = new URL(url);
            Object.keys(params).forEach(key => urlObj.searchParams.append(key, params[key]));
            let response = await fetch(urlObj);
            return response.json();
            
    }

    static async buscarPersonaje(nombre) {
        let johnson = await this.GET("https://api.jikan.moe/v4/characters", {q: nombre});
        return johnson;
    }

}