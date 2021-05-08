import { Currency } from "./shared.model";

export interface CurrencyCardChangeEvent {
    value: Currency;
    indicator: 'from' | 'to';
};
