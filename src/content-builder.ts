import RestClient from "./clients/rest";
import SoapClient from "./clients/soap";

interface ICreateAssetProps {
    name: string;
    file: string;
    // https://developer.salesforce.com/docs/marketing/marketing-cloud/guide/base-asset-types.html
    assetType: {
        id: number;
        name: string;
    }
}

export class ContentBuilder {
    private _rest: RestClient;
    private _soap: SoapClient;

    constructor(rest: RestClient, soap: SoapClient){
        this._rest = rest;
        this._soap = soap;
    }

    public createAsset(props: ICreateAssetProps): Promise<any> {
        return new Promise((resolve, reject) => {
            /**
             * Response example
             * 
             * {
                    id: 163244,
                    customerKey: '5fd42b50-373c-4ba0-adb2-da249893071f',
                    objectID: '28ee7ed1-0e1b-4bd9-882b-9f8ce15c4d84',
                    assetType: { id: 123, name: 'ppt', displayName: 'Document' },
                    fileProperties: {
                        extension: 'ppt',
                        fileSize: 24977,
                        fileCreatedDate: '2021-09-29T06:06:59.4305558-06:00',
                        publishedURL: 'https://image.s10.sfmc-content.com/lib/fe3e15707564007c761272/m/1/28ee7ed1-0e1b-4bd9-882b-9f8ce15c4d84.ppt'
                    },
                    name: 'isobar dev tasks',
                    owner: {
                        id: 715357609,
                        email: '',
                        name: 'Sfmc-Api Package app user',
                        userId: '715357609'
                    },
                    createdDate: '2021-09-29T06:06:59.43-06:00',
                    createdBy: {
                        id: 715357609,
                        email: '',
                        name: 'Sfmc-Api Package app user',
                        userId: '715357609'
                    },
                    modifiedDate: '2021-09-29T06:06:59.43-06:00',
                    modifiedBy: {
                        id: 715357609,
                        email: '',
                        name: 'Sfmc-Api Package app user',
                        userId: '715357609'
                    },
                    enterpriseId: 100041362,
                    memberId: 100041362,
                    status: { id: 2, name: 'Published' },
                    category: { id: 40196, name: 'Content Builder', parentId: 0 },
                    availableViews: [],
                    modelVersion: 2
                }
             */
            this._rest.post('/asset/v1/content/assets', props)
                      .then(r => r.errorcode ? reject(r) : resolve(r))
                      .catch(e => reject(e));
        });
    }

    public deleteAsset(id: string | number): Promise<any> {
        return new Promise((resolve, reject) => {
            this._rest.delete(`/asset/v1/content/assets/${id}`)
                  .then(r => r.errorcode ? reject(r) : resolve(r))
                  .catch(e => reject(e));
        })
    }
}