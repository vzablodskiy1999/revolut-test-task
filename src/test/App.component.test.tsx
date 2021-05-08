import React from 'react';
import { render, act, RenderResult } from '@testing-library/react';
import App from '../App.component';
import { currenciesBaseUrl, LatestRatesResponse } from '../services/currencies.service';
import fetchMock from 'fetch-mock';

const mockResponse: LatestRatesResponse = {
  conversion_rates: {
      USD: 1,
      EUR: 1.2,
      GBP: 1.3
  },
};

describe('App component tests', () => {
  let component: RenderResult;

  beforeAll(() => {
    fetchMock.getOnce(`begin:${currenciesBaseUrl}/latest/USD`, mockResponse);
  });

  beforeEach(async () => {
    await act(async () => {
      component = await render(<App />);
    });
  });

  afterAll(() => {
    fetchMock.restore();
  });

  it('should render application and call endpoint on load', () => {
    expect(component).toBeDefined();
    expect(fetchMock.called(`begin:${currenciesBaseUrl}/latest/USD`)).toBeTruthy();
  });
});
