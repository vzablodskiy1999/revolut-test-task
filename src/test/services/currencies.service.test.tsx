import fetchMock from 'fetch-mock';
import { currenciesBaseUrl, fetchLatestRates, LatestRatesResponse } from '../../services/currencies.service';

const mockResponse: LatestRatesResponse = {
    conversion_rates: {
        USD: 1,
        EUR: 1.2,
        GBP: 1.3
    },
};

describe('Currencies service tests', () => {
    afterEach(() => {
        fetchMock.restore();
    });

    it('should have endpoint to fetch currencies rates', async () => {
        fetchMock.getOnce(`begin:${currenciesBaseUrl}/latest/USD`, mockResponse);
        const expected = {
            USD: 1,
            EUR: 1.2,
            GBP: 1.3
        };

        await fetchLatestRates().then((res: LatestRatesResponse) => {
            expect(res.conversion_rates).toStrictEqual(expected);
        });
    });

    it('should have endpoint to fetch currencies rates and handle error if such', async () => {
        const spy = jest.fn();
        console.error = spy;
        fetchMock.getOnce(`begin:${currenciesBaseUrl}/latest/USD`, {
            throws: 'error',
        });

        await fetchLatestRates().catch((err) => {
            expect(err).toBe('error');
        });
    });
});