class Journey {

}

class JourneyBuilder {
    _client;

    constructor(client){
        this._client = client;
    }

    async getAll(page=1){
        const result = await this._client.get(`/interaction/v1/interactions?$page=${page}`);
        return result.items ? result.items : [];
    }

    async getOne(id, versionNumber){
        const url = `/interaction/v1/interactions/${id}?versionNumber=${versionNumber}`;
        const result = await this._client.get(url);
        return result.items ? result.items : []; 
    }

    async updateVersion(data) {
        delete data.id
        delete data.definitionId
        delete data.version
        data.status = 'Draft'
        const url = `/interaction/v1/interactions/`;
        const result = await this._client.post(url, data);
        return result.items ? result.items : [];
    }

    async update(versionNumber, data) {
        const url = `/interaction/v1/interactions/?versionNumber=${versionNumber}`;
        const result = await this._client.put(url, data);
        return result.items ? result.items : [];
    }

    async pause(id, versionNumber) {
        const url = `/interaction/v1/interactions/pause/${id}?versionNumber=${versionNumber}`;
        const result = await this._client.post(url);
        return result;
    }

    async resume(id, versionNumber) {
        const url = `/interaction/v1/interactions/resume/${id}?versionNumber=${versionNumber}`;
        const result = await this._client.post(url);
        return result;
    }

    async stop(id, versionNumber) {
        const url = `/interaction/v1/interactions/stop/${id}?versionNumber=${versionNumber}`;
        const result = await this._client.post(url);
        return result;
    }

    async publish(id, versionNumber) {
        const url = `/interaction/v1/interactions/publishAsync/${id}?versionNumber=${versionNumber}`,
        const result = await this._client.post(url);
        return result;
    }
}

module.exports = {
    Journey,
    JourneyBuilder
}

