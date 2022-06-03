export class RequestService {
    static async GET(url, params) {
        let urlObj = new URL(url);
        Object.keys(params).forEach(key => urlObj.searchParams.append(key, params[key]));
        let response = await fetch(urlObj);
        return response.json();           
    }

    static async POST(url, params) {
        let response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.json();
    }

}