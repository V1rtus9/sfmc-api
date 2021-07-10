const ET_Client = require('sfmc-fuelsdk-node');

import {DataExtension, DataExtensionRow} from './data-extension';
import {JourneyBuilder} from './journey-builder';

import {IApiClientOptions} from './interfaces/options';

import SoapClient from './clients/soap';
import RestClient from './clients/rest';
import { ContactBuilder } from './contact-builder';

export {
    SfmcApi,
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

    getContactBuilder(): ContactBuilder {
        return new ContactBuilder(this._restClient, this._soapClient);
    }

    getJourneyBuilder(): JourneyBuilder {
        return new JourneyBuilder(this._restClient);
    }
}