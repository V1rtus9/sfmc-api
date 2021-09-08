interface IRequestOptions {
    headers?: {[key: string]: string}
}

export default class RestClient {

    private _instance: any;

    constructor(instance: any) {
        this._instance = instance;
    }

    public get = async (uri: string, options?: IRequestOptions) => {
        return (await this._instance.get({
            uri,
            headers: {
              'Content-Type': 'application/json',
              ...options?.headers
            },
            json: true,
        })).body;
    }

    public post = async (uri:string, body:any) => {
        return (await this._instance.post({
            uri,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
            body
        })).body;
    }

    public put = async (uri: string, body: any) => {
        return (await this._instance.put({
            uri,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
            body
        })).body;
    }

    public delete = async (uri: string) => {
        return (await this._instance.delete({
            uri,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
        })).body;
    }
}