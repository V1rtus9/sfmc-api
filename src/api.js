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

    get = async (uri) => {
        return (await this.restClient.get({
            uri,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true
        })).body;
    }

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
    * @param {String} key 
    * @returns {DataExtension}
    */
    getDataExtension(key) {
        return new DataExtension(key, {
            get: this.get,
            post: this.post
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