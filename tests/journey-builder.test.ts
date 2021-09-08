import instance from './core/instance';

import {tests} from '../config.json';
import {Journey} from '../lib/journey-builder';

describe.skip('Journey Builder', () => {
    let journey: Journey;
    const builder = instance.getJourneyBuilder();

    test('Get journeys', async () => {
        const journeys = 
            await builder.getJourneys();
    
        expect(journeys.length).toBeGreaterThan(0);
    });

    test('Get journeys (pageSize)', async () => {
        /**
         * Parameter 'page' is mandatory to use with 'pageSize' otherwise default size (50) will be used
         */
        const journeys = 
            await builder.getJourneys({
                page: 1,
                pageSize: 60
            });

        expect(journeys.length).toEqual(60);
    });

    test('Get journeys count', async () => {
        const count = 
            await builder.getJourneysCount();

        expect(count).toBeGreaterThan(0);
    });

    test('Get journey', async () => {
        journey = await builder.getJourney(tests.journey);
    
        expect(journey).not.toBeNull();
    });

    test('Create new version', async () => {
        await journey.newVersion();
    });

    test('Publish', async () => {    
        await journey.publish().catch(e => console.log(e))
    });

    test('Pause', async () => {
        await journey.pause().catch(e => console.log(e))
    });

    test('Resume', async () => {    
        await journey.resume().catch(e => console.log(e))
    });

    test('Stop', async () => {    
        await journey.stop().catch(e => console.log(e))
    });
})