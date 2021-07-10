import RestClient from './clients/rest';

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
     * Returns raw journey object that comes from Marketing Cloud
     */
    public get raw() {
        return this._rawData;
    }

    async stop() {
        const url = `/interaction/v1/interactions/stop/${this.id}?versionNumber=${this.version}`;
        const result = await this._rest.post(url);
        return result;
    }

    async pause() {
        const url = `/interaction/v1/interactions/pause/${this.id}?versionNumber=${this.version}`;
        const result = await this._rest.post(url);
        return result;
    }

    async resume() {
        const url = `/interaction/v1/interactions/resume/${this.id}?versionNumber=${this.version}`;
        const result = await this._rest.post(url);
        return result;
    }

    async update(data: any) {
        const url = `/interaction/v1/interactions/?versionNumber=${this.version}`;
        const result = await this._rest.put(url, data);
        return result;
    }

    async publish() {
        const url = `/interaction/v1/interactions/publishAsync/${this.id}?versionNumber=${this.version}`;
        const result = await this._rest.post(url);
        return result;
    }

    async newVersion() {

        delete this._rawData.id
        delete this._rawData.version;
        delete this._rawData.definitionId;

        this._rawData.status = 'Draft';
        const result = await this._rest.post(`/interaction/v1/interactions/`, this._rawData);

        this._rawData = result;
        this.version = result.version;
    }
}

export class JourneyBuilder {
    private _rest: RestClient;

    constructor(rest: RestClient){
        this._rest = rest;
    }

    public async getJourney(id:string, versionNumber?: number): Promise<Journey | null> {
        /**
         * 
            {
                id: '03ca2399-818f-44fa-9baa-106a1d3d0728',
                key: '7f931f23-2516-9a36-e5d6-7f82b098263f',
                name: 'demo 01022020',
                lastPublishedDate: '0001-01-01T00:00:00',
                description: '',
                version: 1,
                workflowApiVersion: 1,
                createdDate: '2021-02-01T03:30:31.907',
                modifiedDate: '2021-02-01T03:30:31.907',
                activities: [
                {
                    id: '71dfb502-93c4-49e1-a608-573e97c26378',
                    key: 'WAITBYDURATION-1',
                    name: '',
                    description: '',
                    type: 'WAIT',
                    outcomes: [Array],
                    arguments: {},
                    configurationArguments: [Object],
                    metaData: [Object],
                    schema: [Object]
                }
                ],
                triggers: [
                {
                    id: '27502fa4-37c3-4cbc-89a3-a414fd3fd8d8',
                    key: 'TRIGGER',
                    name: 'TRIGGER',
                    description: '',
                    type: 'AutomationAudience',
                    outcomes: [],
                    arguments: {},
                    configurationArguments: {},
                    metaData: [Object]
                }
                ],
                goals: [
                {
                    id: '6c345b85-c78e-4b36-b74b-979628c88929',
                    key: 'GOAL',
                    name: 'GOAL',
                    description: '',
                    type: 'Event',
                    outcomes: [],
                    arguments: {},
                    configurationArguments: [Object],
                    metaData: [Object],
                    schema: [Object]
                }
                ],
                exits: [],
                notifiers: [],
                stats: {
                currentPopulation: 0,
                cumulativePopulation: 0,
                metGoal: 0,
                metExitCriteria: 0,
                goalPerformance: 0
                },
                entryMode: 'NotSet',
                definitionType: 'Multistep',
                channel: '',
                defaults: {
                email: [
                    '{{Event.DEAudience-140eb541-b240-9afd-fc0f-d3428653dec4."email"}}'
                ],
                properties: { analyticsTracking: [Object] }
                },
                metaData: {},
                executionMode: 'Production',
                categoryId: 40213,
                status: 'Draft',
                definitionId: '03ca2399-818f-44fa-9baa-106a1d3d0728',
                scheduledStatus: 'Draft'
            }
         * 
         */
        const response = 
            await this._rest.get(
                `/interaction/v1/interactions/${id}${versionNumber ? `?versionNumber=${versionNumber}` : ''}`
            );
        
        return response ? new Journey(response, this._rest) : null; 
    }

    public async getJourneys(page: number = 1): Promise<Array<Journey>>{
        const result = await this._rest.get(`/interaction/v1/interactions?$page=${page}`);

        /**
         * 
            {
                count: 1,
                page: 1,
                pageSize: 50,
                links: {},
                items: [
                    {
                        id: '38422c30-0420-46a1-ab69-3327ea35a3a5',
                        key: '9f7ee1da-119b-294c-729d-1dada7da0d62',
                        name: 'test journey',
                        lastPublishedDate: '0001-01-01T00:00:00',
                        description: '',
                        version: 1,
                        workflowApiVersion: 1,
                        createdDate: '2019-07-22T15:54:48.547',
                        modifiedDate: '2019-07-22T15:55:02.07',
                        goals: [],
                        exits: [],
                        stats: {
                            currentPopulation: 0,
                            cumulativePopulation: 0,
                            metGoal: 0,
                            metExitCriteria: 0,
                            goalPerformance: 0
                        },
                        entryMode: 'NotSet',
                        defaults: {
                            email: [
                                '{{Event.APIEvent-0dbe46de-74f9-a309-7778-298c0a565f93."Email"}}'
                            ],
                            properties: {
                                analyticsTracking: {
                                    enabled: false,
                                    analyticsType: 'google',
                                    urlDomainsToTrack: []
                                }
                            }
                        },
                        metaData: {},
                        executionMode: 'Production',
                        categoryId: 731761,
                        status: 'Draft',
                        definitionId: '38422c30-0420-46a1-ab69-3327ea35a3a5'
                    }
                ]
            }
         */
        return result.items ? result.items.map((x: any) => {
            return new Journey(x, this._rest);
        }) : [];
    }

    public async getJourneysCount(): Promise<number> {
        const response = await this._rest.get(`/interaction/v1/interactions`);
        return response.count;
    }
}

