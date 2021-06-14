import instance from './core/instance';

const de = instance.getDataExtension(process.env.TEST_DE_EXTERNAL_KEY || '');

test('Get name', async () => {
    const name = await de.name();
    expect(name).toBe(process.env.TEST_DE_NAME || '');
});

test('Get count', async () => {
    const count = await de.count();
    expect(count).toBeGreaterThan(0);
});

test('Get rows', async () => {
    const data = await de.find();
    expect(data.length).toBeGreaterThan(0);
});

test('Get rows using simple filter', async () => {
    const data = await de.findMany({
        leftOperand: 'SubscriberKey',
        operator: 'equals',
        rightOperand: '1000000002'
    });

    expect(data.length).toBeGreaterThan(0);
});

test('Get rows using complex filter', async () => {
    const data = await de.findMany({
        leftOperand: {
            leftOperand: 'SubscriberKey',
            operator: 'equals',
            rightOperand: '1000000002'
        },
        operator: 'OR',
        rightOperand: {
            leftOperand:  {
                leftOperand: 'SubscriberKey',
                operator: 'equals',
                rightOperand: '1000000003'
            },
            operator: 'OR',
            rightOperand:  {
                leftOperand: 'SubscriberKey',
                operator: 'equals',
                rightOperand: '1000000004'
            }
        }
    });

    
    expect(data.length).toEqual(3);
});


test('Get fields', async () => {
    const fields = await de.fields();
    expect(fields).toContain(process.env.TEST_DE_FIELD_TO_CHECK || 'SubscriberKey');
});