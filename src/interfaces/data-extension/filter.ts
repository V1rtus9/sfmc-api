type TFilterOperator = 
    'OR' |
    'AND' |
    'isNull' |
    'equals' | 
    'lessThan' |
    'isNotNull' |
    'notEquals' | 
    'greaterThan' | 
    'lessThanOrEqual' |
    'greaterThanOrEqual';

export interface IDataExtensionFilter {
    operator: TFilterOperator;
    leftOperand: string | number | IDataExtensionFilter;
    rightOperand: string | number | IDataExtensionFilter;
}