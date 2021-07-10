import RestClient from "./clients/rest";

export class Journey {

    public id: string;
    public name: string;
    public status: string;
    public version: number;

    private _rest: any;
    private _rawData: any;

    constructor(data: any, rest: any) {
        this._rest = rest;
        this.id = data.id;
        this._rawData = data;
        
        this.name = data.name;
        this.status = data.status;
        this.version = data.version;
    }

    /**
     * @todo Needs to be tested
     */
    async stop() {
        const url = `/interaction/v1/interactions/stop/${this.id}?versionNumber=${this.version}`;
        const result = await this._rest.post(url);
        return result;
    }

    /**
     * @todo Needs to be tested
     */
    async pause() {
        const url = `/interaction/v1/interactions/pause/${this.id}?versionNumber=${this.version}`;
        const result = await this._rest.post(url);
        return result;
    }

    /**
     * @todo Needs to be tested
     */
    async update(data: any) {
        const url = `/interaction/v1/interactions/?versionNumber=${this.version}`;
        const result = await this._rest.put(url, data);
        return result.items ? result.items : [];
    }
    
    /**
     * @todo Needs to be tested
     */
    async resume() {
        const url = `/interaction/v1/interactions/resume/${this.id}?versionNumber=${this.version}`;
        const result = await this._rest.post(url);
        return result;
    }

    /**
     * @todo Needs to be tested
     */   
    async publish() {
        const url = `/interaction/v1/interactions/publishAsync/${this.id}?versionNumber=${this.version}`;
        const result = await this._rest.post(url);
        return result;
    }

    async newVersion() {
        this._rawData.status = 'Draft';

        delete this._rawData.id
        delete this._rawData.version;
        delete this._rawData.definitionId;

        const result = await this._rest.post(`/interaction/v1/interactions/`, this._rawData);

        if(!result){
            throw new Error(`Could not create new verions of journey "${this.id}"`);
        }

        this._rawData = result;
        this.version = result.version;
    }
}

export class JourneyBuilder {
    private _rest: RestClient;

    constructor(rest: RestClient){
        this._rest = rest;
    }

    async getJourney(id:string, versionNumber: number): Promise<Journey | null>{
        const result = 
            await this._rest.get(
                `/interaction/v1/interactions/${id}?versionNumber=${versionNumber}`
            );
        
        return result ? new Journey(result, this._rest) : null; 
    }

    async getJourneys(page: number = 1): Promise<Array<Journey>>{
        const result = await this._rest.get(`/interaction/v1/interactions?$page=${page}`);
        return result.items ? result.items.map((x: any) => {
            return new Journey(x, this._rest);
        }) : [];
    }
}

