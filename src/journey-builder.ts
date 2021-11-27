import RestClient from './clients/rest';

export enum JourneyStatus {
    Draft = 'Draft',
    Stopped = 'Stopped', 
    Deleted = 'Deleted',
    Published = 'Published',
    Unpublished = 'Unpublished', 
    ScheduledToPublish = 'ScheduledToPublish'
}

export class Journey {
    /**
     * Raw journey
     * Objects that comes from MC
     */
    private raw: any;

    public id: string;
    public name: string;
    public version: number;
    public status: JourneyStatus;

    private rest_: RestClient;

    constructor(data: any, rest: RestClient) {
        this.raw = data;
        this.rest_ = rest;

        this.id = data.id;
        this.name = data.name;
        this.status = data.status;
        this.version = data.version;
    }

    async stop(): Promise<{status: string}> {
        return new Promise((resolve, reject) => {
            this.rest_.post(`/interaction/v1/interactions/stop/${this.id}?versionNumber=${this.version}`, {})
                .then(response => {
                    /**
                     * { status: 'Accepted' }
                     * 
                     * Error example
                        {
                            message: 'Published/Paused/Unpublished interaction matching criteria not found.',
                            errorcode: 10000,
                            documentation: ''
                        }
                    *
                    */
                   response.hasOwnProperty('errorcode') ? reject(response) : resolve(response);
                })
                .catch(e => reject(e));
        });
    }

    async pause(): Promise<{status: string}> {
        return new Promise((resolve, reject) => {
            this.rest_.post(`/interaction/v1/interactions/pause/${this.id}?versionNumber=${this.version}`, {})
                .then(response => {
                    /**
                     * { status: 'Accepted' }
                     * 
                     * Error example
                        {
                            message: 'An interaction must be in published or unpublished status to be paused.',
                            errorcode: 10000,
                            documentation: ''
                        }
                    *
                    */
                   response.hasOwnProperty('errorcode') ? reject(response) : resolve(response);
                })
                .catch(e => reject(e));
        });
    }

    async resume(): Promise<{status: string}> {
        return new Promise((resolve, reject) => {
            this.rest_.post(`/interaction/v1/interactions/resume/${this.id}?versionNumber=${this.version}`, {})
                .then(response => {
                    /**
                     * { status: 'Accepted' }
                     * 
                     * Error example
                        {
                            message: 'An interaction must be in paused status to be resumed.',
                            errorcode: 10000,
                            documentation: ''
                        }
                    *
                    */
                   response.hasOwnProperty('errorcode') ? reject(response) : resolve(response);
                })
                .catch(e => reject(e));
        });
    }

    async update(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.rest_.put(`/interaction/v1/interactions/?versionNumber=${this.version}`, data)
                .then(response => {
                    response.hasOwnProperty('errorcode') ? reject(response) : resolve(response);
                })
                .catch(e => reject(e));
        })
    }

    async publish(): Promise<{statusUrl: string, statusId: string}> {
        return new Promise((resolve, reject) => {
            this.rest_.post(`/interaction/v1/interactions/publishAsync/${this.id}?versionNumber=${this.version}`, {})
                .then(response => {
                    /**
                     *  {
                            statusUrl: '/interaction/v1/interactions/publishStatus/8b95543a-a468-4cc7-ba43-d3e90e07038d',
                            statusId: '8b95543a-a468-4cc7-ba43-d3e90e07038d'
                        }
                     *
                     * Error example
                        {
                            message: 'An interaction must be in published or unpublished status to be paused.',
                            errorcode: 10000,
                            documentation: ''
                        }
                    *
                    */
                   response.hasOwnProperty('errorcode') ? reject(response) : resolve(response);
                })
                .catch(e => reject(e));
        });
    }

    async newVersion(): Promise<void> {
        return new Promise((resolve, reject) => {
            delete this.raw.id
            delete this.raw.version;
            delete this.raw.definitionId;

            this.raw.status = JourneyStatus.Draft;
            this.rest_.post(`/interaction/v1/interactions`, this.raw)
                .then(response => {
                    response.hasOwnProperty('errorcode') ? reject(response) : (() => {
                        resolve();
                        this.raw = response;
                        this.version = response.version;
                    })();
                })
                .catch(e => reject(e));
        })
    }
}

export class JourneyBuilder {
    private rest_: RestClient;

    constructor(rest: RestClient){
        this.rest_ = rest;
    }

    public async getJourney(id:string, versionNumber?: number): Promise<Journey> {
       return new Promise((resolve, reject) => {
        /**
         * 
         * Response example
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
         * Error response example
         * 
            {
                documentation: 'https://developer.salesforce.com/docs/atlas.en-us.mc-apis.meta/mc-apis/error-handling.htm',
                errorcode: 404,
                message: 'Not Found'
            }
         */

        this.getRawJourney(id, versionNumber)
            .then(item => resolve(new Journey(item, this.rest_)))
            .catch(e => reject(e))
       });
    }

    public async getRawJourney(id:string, versionNumber?: number): Promise<{[key: string]: any}> {
        return new Promise((resolve, reject) => {
         this.rest_.get(`/interaction/v1/interactions/${id}${versionNumber ? `?versionNumber=${versionNumber}` : ''}`)
             .then(response => {
                 response.hasOwnProperty('errorcode') ? reject(response) : resolve(response);
             })
             .catch(e => reject(e));
        })
    }

    public async getJourneys(args?: {nameOrDescription?: string, page?: number, pageSize?: number, orderBy?: {column: 'modifieddate' | 'name' |'performance', direction: 'asc' | 'desc'}, status?: 'Draft' | 'Published' | 'ScheduledToPublish' | 'Stopped' | 'Unpublished' | 'Deleted' }): Promise<Array<Journey>>{
        return new Promise((resolve, reject) => {
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

        this.getRawJourneys(args)
            .then(items => resolve(items.map((item: any) => new Journey(item, this.rest_))))
            .catch(e => reject(e));
        })
    }

    public async getRawJourneys(args?: {nameOrDescription?: string, page?: number, pageSize?: number, orderBy?: {column: 'modifieddate' | 'name' |'performance', direction: 'asc' | 'desc'}, status?: 'Draft' | 'Published' | 'ScheduledToPublish' | 'Stopped' | 'Unpublished' | 'Deleted' }): Promise<Array<{[key: string]: any}>>{
        return new Promise((resolve, reject) => {
            const url = `/interaction/v1/interactions?${this.getJourneySearchQuery(args || {}).toString()}`;
            this.rest_.get(url)
                .then(response => {
                    response.hasOwnProperty('errorcode') ? reject(response) : resolve(response.items || [])
                })
                .catch(e => reject(e));
        });
    }

    public async getJourneysCount(): Promise<number> {
        return new Promise((resolve, reject) => {
            this.rest_.get(`/interaction/v1/interactions?$page=1&$pageSize=1`)
                .then(response => {
                    response.hasOwnProperty('errorcode') ? reject(response) : resolve(response.count);
                })
                .catch(e => reject(e));
        })
    }

    private getJourneySearchQuery(params: any): URLSearchParams {
        const query = new URLSearchParams();

        Object.keys(params).forEach(key => {
            switch(key){
                case 'page':
                case 'pageSize':
                    query.append('$' + key, params[key])
                    break;
                case 'orderBy':
                    query.append('$' + key, `${params[key].column} ${params[key].direction}`)
                    break;
                default:
                    query.append(key, params[key]);
            }
        }); 

        return query;
    }
}

