import { Rates } from '../models/shared.model';

export interface LatestRatesResponse {
    conversion_rates: Rates;
}

export const currenciesBaseUrl = 'https://v6.exchangerate-api.com/v6/e4c5ca5cc53739df413e541a'

export const fetchLatestRates = (): Promise<LatestRatesResponse> => {
    const url = currenciesBaseUrl + '/latest/USD';

    return fetch(url).then((data) => data.json()).catch((err) => Promise.reject(err));
};