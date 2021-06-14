type TFilterOperator = 
    'OR' |
    'AND' |
    'equals' | 
    'notEquals' | 
    'greaterThan' | 
    'greaterThanOrEqual' |
    'lessThan' |
    'lessThanOrEqual' |
    'existsInString' |
    'existsInStringAsAWord' |
    'notExistsInString' |
    'beginsWith' |
    'isAnniversary' |
    'isNotAnniversary' |
    'greaterThanAnniversary' |
    'lessThanAnniversary';

export interface IDataFilter {
    operator: TFilterOperator;
    leftOperand: string | IDataFilter;
    rightOperand: string | IDataFilter;
}