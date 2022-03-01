
export interface IClientOptins {
    auth: {
        clientId: string;
        clientSecret: string;
    },
    origin: string;
    headers?: {[key: string]: string}
}

export interface IApiClientOptions {
    clientId?: string;
    subdomain?: string;
    accountId?: string;
    clientSecret?: string;
}