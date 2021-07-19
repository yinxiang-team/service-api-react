import 'whatwg-fetch'

let notAuthorizedCounter = 0;

let fetchService = {

    fetch: (url, method, header, body) => {
        if (!header) {
            header = {}
        }

        return fetchService[method.toLowerCase()](url, header, body).catch(function(exception) {
            console.log('fetchService failed:', exception);

            // token过期，重新获取token并发起请求
            if (exception.code === '401' || exception.code === '403') {
                notAuthorizedCounter++;
                // 最多重试3次
                if (notAuthorizedCounter > 2) {
                    notAuthorizedCounter = 0;
                    console.warn("401 or 403 received. Max attemps reached.");
                    return;
                } else {
                    return fetchService.fetch(url, method, header, body);
                }
            }
        });
    },

    get: (url) => {
        console.log("GET : ", url);
        return fetch(url, { method: 'GET', credentials: 'include'})
            .then(response => response.json());
    },

    getBlob: (url) => {
        console.log("GET : ", url);
        return fetch(url, { method: 'GET', credentials: 'include'})
            .then(response => response.blob());
    },

    post: (url, body) => {
        const header = {
            'Content-Type': 'application/json'
        };
        console.log("POST : ", url, body);
        return fetch(url, { method: 'POST', headers: header, credentials: 'include', body: JSON.stringify(body) })
            .then(response=> response.json());
    },

    post2: (url, body) => {
        const header = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        console.log("POST : ", url, body);
        return fetch(url, { method: 'POST', headers: header, credentials: 'include', body: body })
            .then(response=> response);
    }

};

export default fetchService;