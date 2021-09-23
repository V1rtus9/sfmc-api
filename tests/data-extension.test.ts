import crypto from 'crypto';
import instance from './core/instance';

import { DataExtension, DataExtensionRow } from '../lib/data-extension';
import { EDataExtensionFieldType } from '../lib/interfaces/data-extension/field';

describe('DataExtension', () => {

    let de: DataExtension;
    const dataExtensionName: string = crypto.randomBytes(20).toString('hex'); //'Test Data Extension';

    test('Create', async () => {
        de = await instance.getContactBuilder().createDataExtension({
            name: dataExtensionName,
            description: 'Test data extension created by sfmc-api package, will be delete at the end of the test',
            fields: [
                {
                    maxLength: 50,
                    isRequired: true,
                    isPrimaryKey: true,
                    name: 'SubscriberKey',
                    fieldType: EDataExtensionFieldType.Text
                },
                {
                    name: 'Age',
                    isRequired: true,
                    isPrimaryKey: false,
                    fieldType: EDataExtensionFieldType.Number
                },
                {
                    name: 'Name',
                    maxLength: 50,
                    isRequired: true,
                    isPrimaryKey: false,
                    fieldType: EDataExtensionFieldType.Text
                },
                {
                    isRequired: true,
                    name: 'CreatedAt',
                    isPrimaryKey: false,
                    fieldType: EDataExtensionFieldType.Date
                },
                {
                    name: 'Email',
                    isRequired: true,
                    isPrimaryKey: false,
                    fieldType: EDataExtensionFieldType.EmailAddress
                }
            ]
        });
    
        expect(de).toBeDefined();
    });
    
    test('Get name', async () => {
        const name = await de.name();
        expect(name).toBe(dataExtensionName);
    });

    test('Add rows', async () => {
        await de.insertOrUpdate([
            new DataExtensionRow({ subscriberKey: '0001'}, {
                age: '15',
                name: 'Alex',
                email: 'alex@hotmail.ee', 
                createdAt: new Date().toISOString()
            }),
            new DataExtensionRow({ subscriberKey: '0002'}, {
                age: '48',
                name: 'John', 
                email: 'john@hotmail.ee', 
                createdAt: new Date().toISOString()
            }),
            new DataExtensionRow({ subscriberKey: '0003'}, {
                age: '72',
                name: 'Jonathan', 
                email: 'jonathan@hotmail.ee', 
                createdAt: new Date().toISOString()
            }),
            new DataExtensionRow({ subscriberKey: '0004'}, {
                age: '25',
                name: 'Nadia', 
                email: 'nadia@hotmail.ee', 
                createdAt: new Date().toISOString()
            }),
            new DataExtensionRow({ subscriberKey: '0005'}, {
                age: '30',
                name: 'Clara', 
                email: 'clara@hotmail.ee', 
                createdAt: new Date().toISOString()
            })
        ])
    });
    
    test('Get count', async () => {
        const count = await de.count();
        expect(count).toEqual(5);
    });
    
    test('Get rows', async () => {
        const rows = await de.rows();
        expect(rows).toHaveLength(5);
    });

    test('Get rows (unofficial)', async () => {
        const rows = await de.rows2();
        expect(rows).toHaveLength(5); 
    })
    
    test('Get rows using simple filter', async () => {
        const rows = await de.rows({filter: {
            leftOperand: 'SubscriberKey',
            operator: 'equals',
            rightOperand: '0001'
        }});
    
        expect(rows).toHaveLength(1);
    });
    
    test('Get rows using complex filter', async () => {
        const rows = await de.rows({filter: {
            leftOperand: {
                leftOperand: 'SubscriberKey',
                operator: 'equals',
                rightOperand: '0001'
            },
            operator: 'OR',
            rightOperand: {
                leftOperand:  {
                    leftOperand: 'SubscriberKey',
                    operator: 'equals',
                    rightOperand: '0002'
                },
                operator: 'OR',
                rightOperand:  {
                    leftOperand: 'SubscriberKey',
                    operator: 'equals',
                    rightOperand: '0005'
                }
            }
        }});
        
        expect(rows).toHaveLength(3);
    });

    test('Get rows using more complex filter', async () => {
        const rows = await de.rows({filter: {
            leftOperand: {
                leftOperand: {
                    leftOperand: 'Name',
                    operator: 'equals',
                    rightOperand: 'Nadia'
                },
                operator: 'AND',
                rightOperand: {
                    leftOperand: 'Email',
                    operator: 'notEquals',
                    rightOperand: 'nadia2@hotmail.ee'
                }
            },
            operator: 'OR',
            rightOperand: {
                leftOperand: {
                    leftOperand: 'Age',
                    operator: 'greaterThan',
                    rightOperand: 40
                },
                operator: 'OR',
                rightOperand: {
                    leftOperand: 'Age',
                    operator: 'lessThanOrEqual',
                    rightOperand: 15
                }
            }
        }});

        expect(rows).toHaveLength(4);
    })
    
    test('Get fields', async () => {
        const fields = await de.fields();

        expect(fields).toContain('Age');
        expect(fields).toContain('Name');
        expect(fields).toContain('CreatedAt');
        expect(fields).toContain('SubscriberKey');
    });

    test('Delete', async () => {
        await instance.getContactBuilder().deleteDataExtension(de.key);
    })
});