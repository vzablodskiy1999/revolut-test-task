export enum Currency {
    USD = 'USD',
    GBP = 'GBP',
    EUR = 'EUR'
};

export interface State {
    account: Rates;
    rates: Rates;
    selectedCurrencies: {
        from: SelectedCurrency,
        to: SelectedCurrency,
    },
};

export interface SelectedCurrency {
    title: Currency;
    value: number;
};

export interface Rates {
    [Currency.EUR]: number;
    [Currency.USD]: number;
    [Currency.GBP]: number;
};
