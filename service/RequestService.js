export class RequestService {
    static async GET(url, params) {
        let urlObj = new URL(url);
        Object.keys(params).forEach(key => urlObj.searchParams.append(key, params[key]));
        let response = await fetch(urlObj);
        return response.json();           
    }
}