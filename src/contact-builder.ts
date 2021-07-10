const {v4: uuidv4} = require('uuid');

import RestClient from "./clients/rest";
import SoapClient from "./clients/soap";
import { DataExtension } from "./data-extension";
import { IDataExtensionField } from "./interfaces/data-extension/field";

export class ContactBuilder {

    private _rest: RestClient;
    private _soap: SoapClient;

    private _dataExtensions: Map<string, DataExtension>;

    constructor(rest: RestClient, soap: SoapClient){
        this._rest = rest;
        this._soap = soap;
        this._dataExtensions = new Map();
    }

    getDataExtension(key: string) {
        if(this._dataExtensions.has(key)){
            return this._dataExtensions.get(key) as DataExtension;
        }

        const dataExtension = new DataExtension(key, this._rest, this._soap);
        this._dataExtensions.set(key, dataExtension);
        return dataExtension;
    }

    /**
     * Not implemented
     */
    async updateDataExtension(key: string) {
        throw new Error('Not implemented');
    }

    async createDataExtension(props: {name: string, description?: string, fields: IDataExtensionField[]}): Promise<DataExtension> {
        const key = String(uuidv4()).toUpperCase();
        
        /**
         * Response example:
            {
                Results: [
                {
                    StatusCode: 'OK',
                    StatusMessage: 'Data Extension created.',
                    OrdinalID: '0',
                    NewID: '0',
                    NewObjectID: '5857f8c4-8ee1-eb11-b826-48df37dc1641',
                    Object: [Object]
                }
                ],
                RequestID: 'e1e24204-83e9-4b54-9b7e-bef74feb9a25',
                OverallStatus: 'OK'
            }
        */
        const response = await this._soap.create('DataExtension', {
            Name: props.name,
            CustomerKey: key,
            Description: props.description || '',
            Fields: {
                Field: props.fields.map((f: any) => {
                    const field:any = {};

                    Object.keys(f).forEach(key => {
                        field[key.charAt(0).toUpperCase() + key.slice(1)] = f[key];
                    });

                    return field;
                })
            }
        });

        const {OverallStatus, Results} = response;

        if(Results && Array.isArray(Results)){
            if(OverallStatus === 'OK' && Results[0].StatusCode === 'OK'){
                return this.getDataExtension(key);
            }
        }

        throw new Error(`Response: ${JSON.stringify(response)}`);
    }

    async deleteDataExtension(key: string) {
        /**
         * Response example
            {
                Results: [
                {
                    StatusCode: 'OK',
                    StatusMessage: 'Data Extension deleted.',
                    OrdinalID: '0',
                    Object: [Object]
                }
                ],
                RequestID: '34723a72-e871-41d7-b25c-313e541331aa',
                OverallStatus: 'OK'
            }
        *
        */
        const response = await this._soap.delete('DataExtension', {
            CustomerKey: key
        });

        const {OverallStatus} = response;

        if(OverallStatus !== 'OK'){
            throw new Error(`Response: ${JSON.stringify(response)}`);
        }     
    }
}