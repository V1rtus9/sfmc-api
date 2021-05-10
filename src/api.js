const ET_Client = require('sfmc-fuelsdk-node');
const {DataExtension} = require('./data-extension');
const { JourneyBuilder } = require('./journey-builder');

class SfmcApi {

    restClient;
    
    /**
     * 
     * @param {*} options 
     */
    constructor({clientId, clientSecret, subdomain, accountId}){
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

        this.restClient = instance.RestClient;
    }

    /**
     * REST - GET
     * @param {String} uri 
     * @returns {*}
     */
    get = async (uri) => {
        return (await this.restClient.get({
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
    post = async (uri, body) => {
        return (await this.restClient.post({
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
     put = async (uri, body) => {
        return (await this.restClient.put({
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
     delete = async (uri) => {
        return (await this.restClient.delete({
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
    retrieve = async (type, props, filter) => {
        return new Promise((resolve, reject) => {
            this._soapClient.retrieve(type, props, {
                filter
            }, (err, response) => {
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
    getDataExtension(key) {
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

module.exports = {
    SfmcApi
}