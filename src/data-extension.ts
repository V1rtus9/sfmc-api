
export class DataExtensionRow {
    public keys: any;
    public values: any;

    constructor(keys: any, values: any){
        this.keys = keys,
        this.values = values;
    }
}

export class DataExtension {

    private _key: string;
    private _name: string;
    private _client: any;

    constructor(key: string, client: any){
        this._key = key;
        this._name = '';
        this._client = client;
    }

    async name(): Promise<string> {
        if(!this._name){
            const result = await this._client.retrieve('DataExtension', ['Name'], {                     
                leftOperand: 'DataExtension.CustomerKey',
                operator: 'equals',
                rightOperand: this._key
            })

            this._name = result[0].Name;
        }

        return this._name;
    }

    async fields(): Promise<Array<string>> {
        const items = await this._client.retrieve('DataExtensionField', ['Name'], {                     
            leftOperand: 'DataExtension.CustomerKey',
            operator: 'equals',
            rightOperand: this._key
        });

        return items.map((x: any) => x.Name);
    }

    async count(): Promise<number> {
        throw new Error('Not implemented!');
    }

    async find(): Promise<Array<any>> {
        const result = await this._client.get(`/data/v1/customobjectdata/key/${this._key}/rowset/`);
        return result.items ? result.items : [];
    }

    async findMany(filter: any): Promise<Array<any>>{
        throw new Error('Not implemented!');
    }

    async insertOrUpdate(data: DataExtensionRow[]): Promise<Array<DataExtensionRow>> {
        const result = await this._client.post(`/hub/v1/dataevents/key:${this._key}/rowset`, data);
        if(result.errorcode){
            throw new Error(`(SFMC) response: ${JSON.stringify(result)}`);
        }
        return result;
    }

    async delete() {
        throw new Error('Not implemented!');
    }

    async deleteRow() {
        throw new Error('Not implemented!');
    }
}