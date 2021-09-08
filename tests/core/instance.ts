import { SfmcConfig } from './config';
import { SfmcApi } from '../../lib/api';

SfmcConfig.init();

export default new SfmcApi({
    clientId: SfmcConfig.clientId,
    accountId: SfmcConfig.accountId,
    subdomain: SfmcConfig.subdomain,
    clientSecret: SfmcConfig.clientSecret,
});