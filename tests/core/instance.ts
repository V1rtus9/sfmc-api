require('dotenv').config();
import {SfmcApi} from '../../lib/api';

const instance = new SfmcApi({
    clientId: process.env.CLIENT_ID,
    subdomain: process.env.SUBDOMAIN,
    accountId: process.env.ACCOUNT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

export default instance;