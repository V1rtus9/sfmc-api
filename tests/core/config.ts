import fs from 'fs';
import path from 'path';

interface ISfmcTestConfig {
    clientId?: string;
    subdomain?: string;
    accountId?: string;
    fuel2token?: string;
    clientSecret?: string;
}

export const SfmcConfig = new class {
    
    private config: ISfmcTestConfig;

    public init() {
        const fp = path.join(__dirname, '..', '..', 'config.json');

        if(!fs.existsSync(fp)) {
            throw new Error('There is no config file found.')
        }

        this.config = JSON.parse(fs.readFileSync(fp, 'utf8'));
    }

    public get clientId() {
        if(!this.config.clientId) {
            throw new Error('Missing or empty property: "clientId"');
        }

        return this.config.clientId;
    }

    public get accountId() {
        if(!this.config.accountId) {
            throw new Error('Missing or empty property: "accountId"');
        }

        return this.config.accountId;
    }

    public get subdomain() {
        if(!this.config.subdomain) {
            throw new Error('Missing or empty property: "subdomain"');
        }

        return this.config.subdomain;
    }

    public get clientSecret() {
        if(!this.config.clientId) {
            throw new Error('Missing or empty property: "clientSecret"');
        }

        return this.config.clientSecret;
    }

    public get fuel2token() {
        if(!this.config.fuel2token) {
            throw new Error('Missing or empty property: "fuel2token"');
        }

        return this.config.fuel2token;
    }
}