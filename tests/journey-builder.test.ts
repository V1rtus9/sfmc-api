import instance from './core/instance';

describe('Journey Builder', () => {
    const builder = instance.getJourneyBuilder();

    test('Get journey', async () => {
        const journey = 
            await builder.getJourney('03ca2399-818f-44fa-9baa-106a1d3d0728', 1);
    
        expect(journey).not.toBeNull();
    });

    test('Get journeys', async () => {
        const journeys = 
            await builder.getJourneys();
    
        expect(journeys.length).toBeGreaterThan(0);
    });

    test('Get journeys count', async () => {
        const count = 
            await builder.getJourneysCount();
    
        expect(count).toBeGreaterThan(0);
    });
    
    test('Create new version', async () => {
        const journey = 
            await builder.getJourney('03ca2399-818f-44fa-9baa-106a1d3d0728', 1);
    
        await journey?.newVersion();
    });
})