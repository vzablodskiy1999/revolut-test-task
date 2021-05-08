import React, { useState, useEffect } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import './App.css';
import CurrencySelector from './components/CurrencySelector/currency-selector.component';
import { State, Currency } from './models/shared.model';
import { CurrencyCardChangeEvent } from './models/currency-card.model';
import { fetchLatestRates, LatestRatesResponse } from './services/currencies.service';
import RateDisplayer from './components/RateDisplayer/rate-displayer.component';
import CurrencyConverter from './components/CurrencyConverter/currency-converter.component';
import { CurrencyConverterChangeEvent } from './models/currency-converter.model';
import { getNumberWithLeadingZeros } from './utils/currencies.util';

let intervalToken: NodeJS.Timeout;
export const getInitialState = (): State => ({
  account: {
    GBP: 100.01,
    USD: 120.00,
    EUR: 80.00,
  },
  rates: {
    GBP: 0.00,
    USD: 0.00,
    EUR: 0.00,
  },
  selectedCurrencies: {
    from: {
      title: Currency.USD,
      value: 0,
    },
    to: {
      title: Currency.EUR,
      value: 0,
    },
  },
});

const App: React.FC = () => {
  const [state, setState] = useState<State>(getInitialState());

  const handleCurrencySelectorChange = (event: CurrencyCardChangeEvent): void => {
    const oppositeIndicator = event.indicator === 'from' ? 'to' : 'from';

    setState((prevState) => ({
      ...prevState,
      selectedCurrencies: {
        ...prevState.selectedCurrencies,
        [event.indicator]: {
          value: 0,
          title: event.value
        },
        [oppositeIndicator]: {
          ...prevState.selectedCurrencies[oppositeIndicator],
          value: 0,
        }
      }
    }));
  };

  const convertCurrencies = (indicator: 'from' | 'to', value: number, stateLink: State = state): void => {
    const changedCurrencyTitle = stateLink.selectedCurrencies[indicator].title;
    const oppositeIndicator = indicator === 'from' ? 'to' : 'from';
    const oppositeCurrency = stateLink.selectedCurrencies[oppositeIndicator];
    const rate = +(stateLink.rates[oppositeCurrency.title] / stateLink.rates[changedCurrencyTitle]).toFixed(4);

    setState((prevState) => ({
      ...prevState,
      selectedCurrencies: {
        ...prevState.selectedCurrencies,
        [oppositeIndicator]: {
          ...prevState.selectedCurrencies[oppositeIndicator],
          value: +getNumberWithLeadingZeros(rate * value)
        }
      }
    }));
  };

  const handleCurrencyConverterChange = (event: CurrencyConverterChangeEvent): void => {
    const value = String(state.selectedCurrencies[event.indicator].value);
    const eventValue = event.value;
    const lastChar = eventValue[eventValue.length - 1];
    const alreadyHasDot = value.indexOf('.') > -1;
    const oppositeIndicator = event.indicator === 'from' ? 'to' : 'from';
    const charsAfterDot = eventValue.slice(eventValue.indexOf('.') + 1).length;
    const rate = +(state.rates[state.selectedCurrencies[oppositeIndicator].title] / state.rates[state.selectedCurrencies[event.indicator].title]).toFixed(4);
    const oppositeRate = +(state.rates[state.selectedCurrencies[event.indicator].title] / state.rates[state.selectedCurrencies[oppositeIndicator].title]).toFixed(4);
    const maxValue = event.indicator === 'from' ? state.account[state.selectedCurrencies.from.title] : +getNumberWithLeadingZeros(state.account[state.selectedCurrencies.from.title] * oppositeRate);
    const valueToSet = +eventValue > maxValue ? +maxValue : +eventValue;

    if ((eventValue.length < value.length)
      || (lastChar >= '0' && lastChar <= '9' && (!alreadyHasDot || (alreadyHasDot &&  charsAfterDot <= 2)))
      || (lastChar === '.' && !alreadyHasDot && value.length) || !lastChar) {
        setState((prevState) => ({
          ...prevState,
          selectedCurrencies: {
            ...prevState.selectedCurrencies,
            [event.indicator]: {
              ...prevState.selectedCurrencies[event.indicator],
              value: valueToSet
            },
            [oppositeIndicator]: {
              ...prevState.selectedCurrencies[oppositeIndicator],
              value: +getNumberWithLeadingZeros(rate * +eventValue)
            }
          }
        }));
        convertCurrencies(event.indicator, +valueToSet);
    };
  };

  const handleConfirmBtnClick = (): void => {
    const fromAccount = state.selectedCurrencies.from;
    const toAccount = state.selectedCurrencies.to;

    if (fromAccount.title === toAccount.title) {
      return;
    };

    setState({
      ...state,
      account: {
        ...state.account,
        [fromAccount.title]: +getNumberWithLeadingZeros(state.account[fromAccount.title] - fromAccount.value),
        [toAccount.title]: +getNumberWithLeadingZeros(state.account[toAccount.title] + toAccount.value),
      },
      selectedCurrencies: getInitialState().selectedCurrencies
    });
  };

  const fetchAndSetRates = () => {    
    fetchLatestRates().then((data: LatestRatesResponse) => {
      const dataToSet = { 
        USD: data.conversion_rates?.USD,
        EUR: data.conversion_rates?.EUR,
        GBP: data.conversion_rates?.GBP, 
      };
      setState((prevState) => {
        const newState = {
          ...prevState,
          rates: dataToSet
        };

        if (+prevState.selectedCurrencies.from.value) {
          convertCurrencies('from', +prevState.selectedCurrencies.from.value, newState);
        };

        return newState;
      });
    }).catch((err) => {
      console.error(err);
    });
  };

  useEffect(() => {
    fetchAndSetRates();
    intervalToken = setInterval(() => {
      fetchAndSetRates();
    }, 10000);

    return () => {
      clearInterval(intervalToken);
    };
  }, []);

  return (
    <Container className="mt-5">
      <Row className="mb-2">
        <Col>
          <h3>Your balance</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          {Object.keys(state.account).map((key) => (
            <div key={key}>
              {key}: {state.account[key as Currency]}
            </div>
          ))}
        </Col>
      </Row>
      <Row className="mt-5">
        <Col>
          <h3>Convert</h3>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-end">
          <RateDisplayer rates={state.rates} selectedCurrencies={state.selectedCurrencies} />
        </Col>
      </Row>
      <Row>
        <Col>
          <CurrencySelector {...state} onChange={handleCurrencySelectorChange} indicator="from" />
        </Col>
        <Col>
          <CurrencySelector {...state} onChange={handleCurrencySelectorChange} indicator="to" />
        </Col>
      </Row>
      <Row>
        <Col>
          <CurrencyConverter {...state} onChange={handleCurrencyConverterChange} indicator="from" />
        </Col>
        <Col>
          <CurrencyConverter {...state} onChange={handleCurrencyConverterChange} indicator="to" />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <p>
            You are going to sell {state.selectedCurrencies.from.value} {state.selectedCurrencies.from.title} for {state.selectedCurrencies.to.value} {state.selectedCurrencies.to.title}
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button onClick={handleConfirmBtnClick} disabled={state.selectedCurrencies.from.value === 0}>
            Confirm
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
