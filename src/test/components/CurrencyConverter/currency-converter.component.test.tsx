import { RenderResult, render, act, fireEvent } from '@testing-library/react';
import { getInitialState } from '../../../App.component';
import CurrencyConverter from '../../../components/CurrencyConverter/currency-converter.component';

describe('Currency converter component tests', () => {
    let component: RenderResult;
    const spy = jest.fn();

    beforeEach(() => {
        component = render(<CurrencyConverter {...getInitialState()} onChange={spy} indicator="from" />);
    });

    it('should define component', () => {
        expect(component).toBeDefined();
    });

    it('should call onChange spy when onChange fires', () => {
        const input = component.queryByTestId('currency-converter-from');

        act(() => {
            fireEvent.change(input as Element, { target: { value: 'test' } });
        });

        expect(spy).toHaveBeenCalledWith({ indicator: 'from', value: 'test' });
    });
});