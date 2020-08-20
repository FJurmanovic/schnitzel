class HttpClient {
    
    post(url, data) {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let options = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        }
        const req = new Request(url, options);

        return createRequest(req)
    }
    
    put(url, data) {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        let options = {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(data)
        }
        const req = new Request(url, options);

        return createRequest(req)
    }
    
    delete(url, params) {
        let options = {
            method: "DELETE"
        }
        let paramsPath = "";
        if(params) {
            let urlParams = new URLSearchParams(Object.entries(params));
            paramsPath = "?" + urlParams;
        }
        const req = new Request(url + paramsPath, options);

        return createRequest(req)
    }
    
    get(url, params) {
        let options = {
            method: "GET"
        }
        let paramsPath = "";
        if(params) {
            let urlParams = new URLSearchParams(Object.entries(params));
            paramsPath = "?" + urlParams;
        }
        const req = new Request(url + paramsPath, options);

        return createRequest(req)
    }
}

export default new HttpClient();

async function createRequest(request) {
    let response = await fetch(request);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        if(response.headers.get('Content-Type') !== null){
            let newResponse = await createResponse(response);
            return newResponse;
        }
        return response;
    }
}

async function createResponse(response) {
    const type = response.headers.get('Content-Type');
    const body = () => {
        if (type.indexOf('application/json') !== -1){
            return response.json();
        }
        return response.text();
    }

    return body();
}