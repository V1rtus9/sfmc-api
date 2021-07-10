import {SfmcApi} from '../../lib/api';

const instance = new SfmcApi({
    ...require('../../config.json')
});

export default instance;