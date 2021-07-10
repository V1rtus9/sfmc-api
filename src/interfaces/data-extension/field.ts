export enum EDataExtensionFieldType {
    Text = 'Text',
    Date = 'Date',
    Number = 'Number',
    Boolean = 'Boolean',
    EmailAddress = 'EmailAddress'
}

export interface IDataExtensionField {
    name: string;
    maxLength?: number;
    isRequired?: boolean;
    isPrimaryKey?: boolean;
    fieldType: EDataExtensionFieldType;
}