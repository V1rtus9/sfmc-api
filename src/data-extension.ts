import RestClient from "./clients/rest";
import SoapClient from "./clients/soap";
import { IDataExtensionFilter } from "./interfaces/data-extension/filter";

export class DataExtensionRow {
    private _keys: {[key: string]: string};
    private _values: {[key: string]: string};

    constructor(keys: {[key: string]: string}, values: {[key: string]: string}){
        this._keys = keys,
        this._values = values;
    }

    public get keys() {
        return this._keys;
    }

    public get values() {
        return this._values;
    }

    getValues(): {[key: string]: string} {
        return {
            ...this.keys,
            ...this.values
        }
    }
}

export class DataExtension {

    private _id: string;
    private _key: string;
    private _name: string;

    private _rest: RestClient;
    private _soap: SoapClient;

    private _isSendable: string;
    private _fields: string[] = [];

    constructor(key: string, rest: RestClient, soap: SoapClient){
        this._id = '',
        this._key = key;
        this._name = '';
        this._isSendable = '';

        this._soap = soap;
        this._rest = rest;
    }

    //#region Properties

    public get key(): string {
        return this._key;
    }

    //#endregion

    //#region  Public methods

    /**
     * @deprecated
     */
    public async name(): Promise<string> {
        return this.getName();
    }

    public async getName(): Promise<string> {
        if(!this._name){
            await this.getProperties();
        }

        return this._name;
    }

    public async isSendable(): Promise<boolean> {
        if(!this._isSendable) {
            await this.getProperties();
        }

        return this._isSendable === 'true';
    }

    /**
     * @deprecated
     */
    public async fields(): Promise<Array<string>> {
        return this.getFields();
    }

    public async getFields(): Promise<Array<string>> {
        if(this._fields.length > 0){
            return this._fields;
        }

        /**
         * Response example
            {
                OverallStatus: 'OK',
                RequestID: '5754bc94-d629-4f01-b315-a4cc988b48e4',
                Results: [
                    { PartnerKey: '', ObjectID: '', Name: 'Email' },
                    { PartnerKey: '', ObjectID: '', Name: 'Age' },
                    { PartnerKey: '', ObjectID: '', Name: 'CreatedAt' },
                    { PartnerKey: '', ObjectID: '', Name: 'SubscriberKey' },
                    { PartnerKey: '', ObjectID: '', Name: 'Name' }
                ]
            }
         */
        const {Results}: any = await this._soap.retrieve('DataExtensionField', ['Name'], {
            filter:  {
                leftOperand: 'DataExtension.CustomerKey',
                operator: 'equals',
                rightOperand: this._key
            }
        });

        this._fields = Results.map((x: any) => x.Name);
        return this._fields;
    }

    /**
     * @deprecated
     */
    public async count(): Promise<number> {
        return this.getRowsCount();
    }

    public async getRowsCount(): Promise<number> {
        /**
        *  Response exampl
            {
                links: {
                    self: '/v1/customobjectdata/token/3934bf37-a0a4-4312-94ba-b4b071079146/rowset?$page=1',
                    next: '/v1/customobjectdata/token/3934bf37-a0a4-4312-94ba-b4b071079146/rowset?$page=2' 
                },
                requestToken: '3934bf37-a0a4-4312-94ba-b4b071079146',
                tokenExpireDateUtc: '2021-07-11T20:11:29.59',
                customObjectId: '8a16c900-bbe1-eb11-b826-48df37dc1641',
                customObjectKey: '876EF229-5F56-4219-AEBC-2DE57D24EA75',
                pageSize: 1,
                page: 1,
                count: 5,
                top: 0,
                items: [ { keys: [Object], values: [Object] } ]
            }
        *
        */
        const response = await this._rest.get(`/data/v1/customobjectdata/key/${this._key}/rowset?$pageSize=1`);
        return response.count;
    }

    /**
     * @deprecated
     */
    public async rows(options?: {fields?: string[], filter?: IDataExtensionFilter}): Promise<Array<{[key: string]: string}>> {
        return this.getRows(options);
    }

    public async getRows(options?: {fields?: string[], filter?: IDataExtensionFilter}): Promise<Array<{[key: string]: string}>> {
        const fields = options?.fields || await this.getFields();
        /**
         * Response example
            {
                OverallStatus: 'OK',
                RequestID: '27af3534-9be2-4705-a002-b56711b7550c',
                Results: [
                    {
                        PartnerKey: '',
                        ObjectID: '',
                        Type: 'DataExtensionObject',
                        Properties: {
                           Property: [
                                { Name: 'Email', Value: 'alex@hotmail.ee' },
                                { Name: 'Name', Value: 'Alex' },
                                { Name: 'CreatedAt', Value: '7/10/2021 2:28:20 PM' },
                                { Name: 'SubscriberKey', Value: '0001' },
                                { Name: 'Age', Value: '15' }
                            ]
                        }
                    }
                ]
            }
         *
         */
        const { Results } = await this._soap.retrieve(`DataExtensionObject[${this._key}]`, fields, {
            filter: options?.filter
        });

        if(Array.isArray(Results)){
            return Results.map(item => {
                if(Array.isArray(item.Properties.Property)) {
                    const row:any = {};
                    item.Properties.Property.forEach(({Name, Value}: any) => {
                        row[String(Name).toLocaleLowerCase()] = Value;
                    });
                    return row;
                }

                const property = item.Properties.Property;
                if(property) {
                    return {
                        [String(property['Name']).toLocaleLowerCase()]: String(property['Value'])
                    }
                }

                return undefined;
            });
        }

        return [];
    }

    /**
     * @deprecated
     */
    public async rows2(page: number = 1): Promise<DataExtensionRow[]> {
        return this.getRowsUnofficial(page);
    }
    /**
     * This methods uses unofficial rest endpoint, there is no guarantee that it will be working in future.
     * As opposed to the 'rows' method there is no any issue working with shared data extension, data is accessible from any business unit.
     */
    public async getRowsUnofficial(page: number = 1): Promise<DataExtensionRow[]> {
       /**
        *  Response example     
            {
                links: {
                    self: '/v1/customobjectdata/token/3934bf37-a0a4-4312-94ba-b4b071079146/rowset?$page=1',
                    next: '/v1/customobjectdata/token/3934bf37-a0a4-4312-94ba-b4b071079146/rowset?$page=2' 
                },
                requestToken: '3934bf37-a0a4-4312-94ba-b4b071079146',
                tokenExpireDateUtc: '2021-07-11T20:11:29.59',
                customObjectId: '8a16c900-bbe1-eb11-b826-48df37dc1641',
                customObjectKey: '876EF229-5F56-4219-AEBC-2DE57D24EA75',
                pageSize: 1,
                page: 1,
                count: 5,
                top: 0,
                items: [ { keys: [Object], values: [Object] } ]
            }
        *
        */
        const {items} = await this._rest.get(`/data/v1/customobjectdata/key/${this._key}/rowset?$page=${page}`);

        if(Array.isArray(items)){
            return items.map(item => {
                return new DataExtensionRow(item.keys, item.values);
            })
        }

        return [];
    }

    public async insertOrUpdate(data: DataExtensionRow[]): Promise<Array<DataExtensionRow>> {
        return new Promise((resolve, reject) => {
            this._rest.post(`/hub/v1/dataevents/key:${this._key}/rowset`, data.map(x => {
                return {
                    keys: x.keys,
                    values: x.values
                }
            }))
            .then(result => {
                result.errorcode ? reject(result) : resolve(result);
            })
            .catch(e => reject(e.message));
        })
    }

    //#endregion 

    //#region Private methods

    private async getProperties() {
        const props = [
            'Name',
            'ObjectID',
            'IsSendable',
            'CustomerKey'
        ];

        /**
         *
            {
                OverallStatus: 'OK',
                RequestID: 'bd41831c-0b28-4d72-bb81-ac46f28c7c57',
                Results: [
                    {
                        PartnerKey: '',
                        ObjectID: '30336247-bee1-eb11-b826-48df37dc1641',
                        CustomerKey: '0F63D43C-50D9-45B7-8D1F-D9B1C92D8F40',
                        Name: 'Test Data Extension 3',
                        IsSendable: 'false'
                    }
                ]
            }
         *
         */
        const {Results}: any = await this._soap.retrieve('DataExtension', props, {
            filter: { leftOperand: 'DataExtension.CustomerKey',
             operator: 'equals',
             rightOperand: this._key}
        });

        this._name = Results[0].Name;
        this._id = Results[0].ObjectID;
        this._isSendable = Results[0].IsSendable;
    }

    //#endregion
}