import instance from './core/instance';

import { Platform } from "../lib/api";
import { SfmcConfig } from "./core/config";

describe('Marketing Cloud', () => {
    test('Context', async () => {
        const {organization: {id}} = await instance.getContext();

        expect(id)
            .toBe(SfmcConfig.accountId);
    })

    test.skip('Fuel2Token Context', async () => {
        const {organization: {id}} = await Platform.getFuel2TokenContext(SfmcConfig.fuel2token, SfmcConfig.subdomain);

        expect(id)
            .toBe(SfmcConfig.accountId);
    })
});