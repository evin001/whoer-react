import fetch from 'isomorphic-fetch';
import _ from 'lodash';

class Api {
    constructor() {
        this.rootUrl = 'http://new.whoer.net';
    }

    async fetch(url, method = 'GET', data = {}, heads = {}, isAuth = false) {
        try {
            const headers = {
                Origin: this.rootUrl,
                'Content-Type': 'application/json',
                ...heads,
            };

            let body;
            if (method === 'GET') {
                body = _.isEmpty(data) ? undefined : data;
            } else {
                body = JSON.stringify(data);
            }

            const response = await fetch(`${this.rootUrl}/${url}`, {
                method,
                headers,
                credentials: isAuth ? 'include' : 'omit',
                mode: 'cors',
                body,
            });

            if (response.ok) {
                const text = await response.text();
                return text ? JSON.parse(text) : {};
            }

            throw new Error(`${response.statusText} [${response.status}]`);
        } catch (error) {
            throw error.message;
        }
    }

    getRootUrl() {
        return this.rootUrl;
    }
}

export default new Api();
