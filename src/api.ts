const ET_Client = require('sfmc-fuelsdk-node');

import axios from 'axios';
import SoapClient from './clients/soap';
import RestClient from './clients/rest';

import {
    DataExtension,
    DataExtensionRow } from './data-extension';
import { ITokenContext } from './models/context';
import { ContentBuilder } from './content-builder';
import { JourneyBuilder } from './journey-builder';
import { ContactBuilder } from './contact-builder';
import { IApiClientOptions } from './models/options';
export {
    SfmcApi,
    Platform,
    DataExtensionRow,
}

class SfmcApi {

    private _restClient: RestClient;
    private _soapClient: SoapClient;

    constructor({clientId, clientSecret, subdomain, accountId}: IApiClientOptions){
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

        this._restClient = new RestClient(instance.RestClient);
        this._soapClient = new SoapClient(instance.SoapClient);
    }

    //#region Getters

    public get rest(): RestClient {
        return this._restClient;
    }

    public get soap(): SoapClient {
        return this._soapClient;
    }

    //#endregion

    getContext(): Promise<ITokenContext> {
        return this._restClient.get('/platform/v1/tokenContext');
    }

    getContentBuilder(): ContentBuilder {
        return new ContentBuilder(this._restClient, this._soapClient);
    }

    getContactBuilder(): ContactBuilder {
        return new ContactBuilder(this._restClient, this._soapClient);
    }

    getJourneyBuilder(): JourneyBuilder {
        return new JourneyBuilder(this._restClient);
    }
}

class Platform {
    static getFuel2TokenContext(token: string, subdomain: string): Promise<ITokenContext> {
        return new Promise((resolve, reject) => {
            axios.get(`https://${subdomain}.rest.marketingcloudapis.com/platform/v1/tokenContext`, {headers: {
                'Authorization': `Bearer ${token}`
            }})
                 .then(response => resolve(response.data))
                 .catch(e => reject(e));
        })
    }
}