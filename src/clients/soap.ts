interface IKeyValuePairProps {
    [key: string]: string | IKeyValuePairProps
}

export default class SoapClient {
    private _instance: any;

    constructor(instance: any) {
        this._instance = instance;
    }

    public create = (type: string, props: {[key: string]: any}): Promise<any> => {
        return new Promise((resolve, reject) => {
            this._instance.create(type, props, {}, (err: any, response: any) => {
                return err ? reject(err.message) : resolve(response.body);
            })
        })
    }

    public retrieve = (type: string, props: Array<string>, options: any): Promise<any> => {
        return new Promise((resolve, reject) => {
            this._instance.retrieve(type, props, options, (err: any, response: any) => {
                return err ? reject(err.message) : resolve(response.body);
            })
        })
    }

    public update = (type: string, props: unknown, options: any) => {
        throw new Error('Not implemented');
    }

    public delete = (type: string, props: {[key: string]: any}): Promise<any> => {
        return new Promise((resolve, reject) => {
            this._instance.delete(type, props, {}, (err: any, response: any) => {
                return err ? reject(err.message) : resolve(response.body);
            })
        })
    }
}