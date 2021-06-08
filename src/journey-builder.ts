export class Journey {

    public id: string;
    public status: string;
    public version: number;

    private _client: any;
    private _rawData: any;

    constructor(data: any, client: any){
        this.id = data.id;
        this._rawData = data;
        this._client = client;
        this.status = data.status;
        this.version = data.version;
    }

    /**
     * @todo Needs to be tested
     */
    async stop() {
        const url = `/interaction/v1/interactions/stop/${this.id}?versionNumber=${this.version}`;
        const result = await this._client.post(url);
        return result;
    }

    /**
     * @todo Needs to be tested
     */
    async pause() {
        const url = `/interaction/v1/interactions/pause/${this.id}?versionNumber=${this.version}`;
        const result = await this._client.post(url);
        return result;
    }

    /**
     * @todo Needs to be tested
     */
    async update(data: any) {
        const url = `/interaction/v1/interactions/?versionNumber=${this.version}`;
        const result = await this._client.put(url, data);
        return result.items ? result.items : [];
    }
    
    /**
     * @todo Needs to be tested
     */
    async resume() {
        const url = `/interaction/v1/interactions/resume/${this.id}?versionNumber=${this.version}`;
        const result = await this._client.post(url);
        return result;
    }

    /**
     * @todo Needs to be tested
     */   
    async publish() {
        const url = `/interaction/v1/interactions/publishAsync/${this.id}?versionNumber=${this.version}`;
        const result = await this._client.post(url);
        return result;
    }

    /**
     * @todo Needs to be tested
     */
    async updateVersion(data: any) {
        delete data.id
        delete data.version;
        delete data.definitionId

        data.status = 'Draft'

        const result = await this._client.post(`/interaction/v1/interactions/`, data);
        return result.items ? result.items : [];
    }
}

export class JourneyBuilder {
    private _client: any;

    constructor(client: any){
        this._client = client;
    }

    async getJourney(id:string, versionNumber: number): Promise<Journey | null>{
        const result = 
            await this._client.get(
                `/interaction/v1/interactions/${id}?versionNumber=${versionNumber}`
            );
        
        return result ? new Journey(result, this._client) : null; 
    }

    async getJourneys(page: number = 1): Promise<Array<Journey>>{
        const result = await this._client.get(`/interaction/v1/interactions?$page=${page}`);
        return result.items ? result.items.map((x: any) => {
            return new Journey(x, this._client);
        }) : [];
    }
}

