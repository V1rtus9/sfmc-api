const ET_Client = require('sfmc-fuelsdk-node');

import {DataExtension, DataExtensionRow} from './data-extension';
import {Journey, JourneyBuilder} from './journey-builder';

import {ISfmcApiCache} from './interfaces/cache';
import {IClient} from './interfaces/client';
import {IApiOptions} from './interfaces/options';

export {
    SfmcApi,
    DataExtensionRow,
}

class SfmcApi {

    private _client: IClient;
    private _restClient: any;
    private _soapClient: any;
    
    constructor({clientId, clientSecret, subdomain, accountId}: IApiOptions){
        if(!clientId) throw new Error('Client ID is missing!');
        if(!subdomain) throw new Error('Subdomain is missing!');
        if(!accountId) throw new Error('Account ID is missing!');
        if(!clientSecret) throw new Error('Client Secret is missing!');

        const instance = new ET_Client(
            clientId,
            clientSecret,
            null,
            {
                origin: `https://${subdomain}.rest.marketingcloudapis.com/`,
                authOrigin: `https://${subdomain}.auth.marketingcloudapis.com/`,
                soapOrigin: `https://${subdomain}.soap.marketingcloudapis.com/`,
                authOptions: {
                    accountId,
                    authVersion: 2
                }
        });

        this._restClient = instance.RestClient;
        this._soapClient = instance.SoapClient;

        this._client = {
            get: this.get,
            put: this.put,
            post: this.post,
            delete: this.delete,
            retrieve: this.retrieve
        }
    }

    public get = async (uri: string) => {
        return (await this._restClient.get({
            uri,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true
        })).body;
    }

    public post = async (uri:string, body:any) => {
        return (await this._restClient.post({
            uri,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
            body
        })).body;
    }

    public put = async (uri: string, body: any) => {
        return (await this._restClient.put({
            uri,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
            body
        })).body;
    }

    public delete = async (uri: string) => {
        return (await this._restClient.delete({
            uri,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
        })).body;
    }

    public retrieve = async (type: string, props: any[], filter: any) => {
        return new Promise((resolve, reject) => {
            this._soapClient.retrieve(type, props, {
                filter
            }, (err: any, response: any) => {
                if(err) reject(err);
                
                const {Results, OverallStatus} = response.body;
                OverallStatus === 'OK' ?
                    resolve(Results) :
                    reject(JSON.stringify(response.body));
            })
        })
    }

    getJourneyBuilder(): JourneyBuilder {
        return new JourneyBuilder(this._client)
    }

    getDataExtension(key: string): DataExtension {
        return new DataExtension(key, this._client);
    }
}