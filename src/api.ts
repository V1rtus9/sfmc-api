const ET_Client = require('sfmc-fuelsdk-node');
import {DataExtension} from './data-extension';
import {JourneyBuilder} from './journey-builder';

interface ISfmcApiProps {
    clientId: string | undefined;
    subdomain: string | undefined;
    accountId: string | undefined;
    clientSecret: string | undefined;
}

export class SfmcApi {

    private _restClient;
    private _soapClient;
    
    /**
     * 
     * @param {*} options 
     */
    constructor({clientId, clientSecret, subdomain, accountId}: ISfmcApiProps){
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
    }

    /**
     * REST - GET
     * @param {String} uri 
     * @returns {*}
     */
    public get = async (uri: string) => {
        return (await this._restClient.get({
            uri,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true
        })).body;
    }

    /**
     * REST - POST
     * @param {String} uri 
     * @param {*} body 
     * @returns {*}
     */
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

    /**
     * REST - PUT
     * @param {String} uri 
     * @param {*} body 
     * @returns {*}
     */
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

    /**
     * REST - DELETE
     * @param {String} uri 
     * @returns {*}
     */
    public delete = async (uri: string) => {
        return (await this._restClient.delete({
            uri,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
        })).body;
    }

    /**
     * SOAP
     * @param {String} type 
     * @param {Array<String>} props 
     * @param {*} filter 
     * @returns 
     */
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

    /**
    * @param {String} key 
    * @returns {DataExtension}
    */
    getDataExtension(key: string) {
        return new DataExtension(key, {
            get: this.get,
            post: this.post,
            retrieve: this.retrieve
        });
    }

    /**
    * @returns {JourneyBuilder}
    */
    getJourneyBuilder() {
        return new JourneyBuilder({
            get: this.get,
            post: this.post
        })
    }
}