import instance from './core/instance';

const de = instance.getDataExtension(process.env.TEST_DE_EXTERNAL_KEY || '');

test('Get name', async () => {
    const name = await de.name();
    expect(name).toBe(process.env.TEST_DE_NAME || '');
});

test('Get rows', async () => {
    const data = await de.find();
    expect(data.length).toBeGreaterThan(0);
});

test('Get fields', async () => {
    const fields = await de.fields();
    expect(fields).toContain(process.env.TEST_DE_FIELD_TO_CHECK || 'SubscriberKey');
});