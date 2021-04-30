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


class DataExtension {
    client;
    /**
     * 
     * @param {String} key 
     * @param {*} client
     */
    constructor(key, client){
        this.key = key;
        this.client = client;
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
        const result = await this.client.get(`/data/v1/customobjectdata/key/${this.key}/rowset/`);
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
        const result = await this.client.post(`/hub/v1/dataevents/key:${this.key}/rowset`, data);
        return result;
    }
}

module.exports = {
    DataExtension,
    DataExtensionRow
}