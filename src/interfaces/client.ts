export interface IClient {
    get: (uri: string) => Promise<any>;
    delete: (uri: string) => Promise<any>;
    put: (uri: string, body?: any) => Promise<any>;
    post: (uri: string, body?: any) => Promise<any>;
    retrieve: (type: string, props: any[], filter: any) => Promise<any>
}