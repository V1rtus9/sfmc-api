/**
 * 
 */
 class DataExtensionRow {
    keys;
    values;

    /**
     * 
     * @param {*} keys 
     * @param {*} values 
     */
    constructor(keys, values){
        this.keys = keys,
        this.values = values;
    }
}

/**
 * 
 */
class DataExtension {
    _key;
    _name;
    _client;
    /**
     * 
     * @param {String} key 
     * @param {*} client
     */
    constructor(key, client){
        this._key = key;
        this._client = client;
    }

    /**
     * 
     * @returns {Promise<String>}
     */
    async name() {
        if(!this._name){
            const result = await this._client.retrive('DataExtension', ['Name'], {                     
                leftOperand: 'DataExtension.CustomerKey',
                operator: 'equals',
                rightOperand: this._key
            })

            this._name = result[0].Name;
        }

        return this._name;
    }

    /**
     * 
     * @returns {Promise<Array<String>>}
     */
    async fields() {
        const items = await this._client.retrieve('DataExtensionField', ['Name'], {                     
            leftOperand: 'DataExtension.CustomerKey',
            operator: 'equals',
            rightOperand: this._key
        });

        return items.map(x => x.Name);
    }

    /**
     * @returns {Promise<Array<any>>}
     */
    async count() {
        //TODO
    }

    /**
     * @returns {Promise<Array<any>>}
     */
    async find() {
        const result = await this._client.get(`/data/v1/customobjectdata/key/${this._key}/rowset/`);
        return result.items ? result.items : [];
    }

    /**
     * @param {*} filter 
     * @returns {Promise<Array<any>>}
     */
    async findMany(filter){
        //TODO
    }

    /**
     * 
     * @param {Array<DataExtensionRow>} data 
     */
    async insertOrUpdate(data) {
        const result = await this._client.post(`/hub/v1/dataevents/key:${this._key}/rowset`, data);
        if(result.errorcode){
            throw new Error(`(SFMC) response: ${JSON.stringify(result)}`);
        }
        return result;
    }

    async delete() {

    }

    async deleteRow() {
        
    }
}

module.exports = {
    DataExtension,
    DataExtensionRow
}