type TFilterOperator = 
    'OR' |
    'AND' |
    'equals' | 
    'lessThan' |
    'notEquals' | 
    'greaterThan' | 
    'lessThanOrEqual' |
    'greaterThanOrEqual';

export interface IDataExtensionFilter {
    operator: TFilterOperator;
    leftOperand: string | number | IDataExtensionFilter;
    rightOperand: string | number | IDataExtensionFilter;
}