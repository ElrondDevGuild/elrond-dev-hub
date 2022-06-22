export default class ApiResponse {
    private _body: any;
    private _status: number;
    private _headers: [];

    constructor({body, status, headers}: {
        body?: any;
        status?: number;
        headers?: [];
    } = {}) {
        this._body = body ?? null;
        this._status = status ?? 200;
        this._headers = headers ?? [];
    }

    body(value: any) {
        this._body = value;

        return this;
    }

    status(value: number) {
        this._status = value;

        return this;
    }

    headers(value: []) {
        this._headers.push(...value);

        return this;
    }

    getBody() {
        return this._body;
    }

    getStatus(): number {
        return this._status;
    }

    getHeaders(): [] {
        return this._headers;
    }
};