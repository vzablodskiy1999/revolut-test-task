export interface CurrencyConverterChangeEvent {
    value: string;
    indicator: 'from' | 'to';
};