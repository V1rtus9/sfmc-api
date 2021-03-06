import RestClient from './clients/rest';
import { JourneyStatus } from './models/journey';

export class Journey {

    public id: string;
    public name: string;
    public version: number;
    public status: JourneyStatus;

    private restClient: RestClient;
    /**
     * Raw journey
     * Objects that comes from MC
     */
    private originalObject: {[key: string]: any};

    constructor (data: any, restClient: RestClient) {
        this.originalObject = data;
        this.restClient = restClient;

        this.id = data.id;
        this.name = data.name;
        this.status = data.status;
        this.version = data.version;
    }

    public getRawObject() {
        return this.originalObject;
    };

    public async stop(): Promise<{status: string}> {
        return new Promise((resolve, reject) => {
            this.restClient.post(`/interaction/v1/interactions/stop/${this.id}?versionNumber=${this.version}`, {})
                .then((response: any) => {
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
                .catch((e: Error) => reject(e));
        });
    }

    public async pause(): Promise<{status: string}> {
        return new Promise((resolve, reject) => {
            this.restClient.post(`/interaction/v1/interactions/pause/${this.id}?versionNumber=${this.version}`, {})
                .then((response: any) => {
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
                .catch((e: Error) => reject(e));
        });
    }

    public async resume(): Promise<{status: string}> {
        return new Promise((resolve, reject) => {
            this.restClient.post(`/interaction/v1/interactions/resume/${this.id}?versionNumber=${this.version}`, {})
                .then((response: any) => {
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
                .catch((e: Error) => reject(e));
        });
    }

    public async update(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.restClient.put(`/interaction/v1/interactions/?versionNumber=${this.version}`, data)
                .then((response: any) => {
                    response.hasOwnProperty('errorcode') ? reject(response) : resolve(response);
                })
                .catch((e: Error) => reject(e));
        })
    }

    public async publish(): Promise<{statusUrl: string, statusId: string}> {
        return new Promise((resolve, reject) => {
            this.restClient.post(`/interaction/v1/interactions/publishAsync/${this.id}?versionNumber=${this.version}`, {})
                .then((response: any) => {
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
                .catch((e: Error) => reject(e));
        });
    }

    public getPublishStatus = (statusId: string): Promise<{ status: string, errors: Array<{ errorDetail: string,  errorCode: string, additionalInfo: {[key: string]: any} }>}> => {
        return new Promise((resolve, reject) => {
            this.restClient.get(`/interaction/v1/interactions/publishStatus/${statusId}`, {})
                .then((response: any) => {
                    /**
                     * { status: 'PublishInProcess', errors: [] }
                     * { status: 'PublishCompleted', errors: [] }
                     * {
                            status: 'Error',
                            errors: [
                                {
                                errorDetail: 'This Email activity is not configured. Configure all activities before activating.',
                                errorCode: '121331',
                                additionalInfo:  {
                                        activityKey: 'EMAILV2-1',
                                        activityId: 'cf732c8f-2475-4596-906a-7c81b1f8b659',
                                        activityType: 'EMAILV2',
                                        definitionId: 'e844fc1a-6ce0-4d26-9185-89081171d1de'
                                    }
                                }
                            ]
                        }
                     */
                   response.hasOwnProperty('status') ? resolve(response) : reject(response);
                })
                .catch((e: Error) => reject(e));
        });
    }

    async createNewVersion(): Promise<void> {
        return new Promise((resolve, reject) => {
            delete this.originalObject.id
            delete this.originalObject.version;
            delete this.originalObject.definitionId;

            this.originalObject.status = JourneyStatus.Draft;
            this.restClient.post(`/interaction/v1/interactions`, this.originalObject)
                .then((response: any) => {
                    response.hasOwnProperty('errorcode') ? reject(response) : (() => {
                        resolve();
                        this.originalObject = response;
                        this.version = response.version;
                    })();
                })
                .catch((e: Error) => reject(e));
        })
    }
}

export class JourneyBuilder {
    private restClient: RestClient;

    constructor(restClient: RestClient){
        this.restClient = restClient;
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
            .then(item => resolve(new Journey(item, this.restClient)))
            .catch(e => reject(e))
       });
    }

    public async getRawJourney(id:string, versionNumber?: number): Promise<{[key: string]: any}> {
        return new Promise((resolve, reject) => {
         this.restClient.get(`/interaction/v1/interactions/${id}${versionNumber ? `?versionNumber=${versionNumber}` : ''}`)
             .then((response: any) => {
                 response.hasOwnProperty('errorcode') ? reject(response) : resolve(response);
             })
             .catch((e: Error) => reject(e));
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
            .then(items => resolve(items.map((item: any) => new Journey(item, this.restClient))))
            .catch(e => reject(e));
        })
    }

    public async getRawJourneys(args?: {nameOrDescription?: string, page?: number, pageSize?: number, orderBy?: {column: 'modifieddate' | 'name' |'performance', direction: 'asc' | 'desc'}, status?: 'Draft' | 'Published' | 'ScheduledToPublish' | 'Stopped' | 'Unpublished' | 'Deleted' }): Promise<Array<{[key: string]: any}>>{
        return new Promise((resolve, reject) => {
            const url = `/interaction/v1/interactions?${this.getJourneySearchQuery(args || {}).toString()}`;
            this.restClient.get(url)
                .then((response: any) => {
                    response.hasOwnProperty('errorcode') ? reject(response) : resolve(response.items || [])
                })
                .catch((e: Error) => reject(e));
        });
    }

    public async getJourneysCount(): Promise<number> {
        return new Promise((resolve, reject) => {
            this.restClient.get(`/interaction/v1/interactions?$page=1&$pageSize=1`)
                .then((response: any) => {
                    response.hasOwnProperty('errorcode') ? reject(response) : resolve(response.count);
                })
                .catch((e: Error) => reject(e));
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

