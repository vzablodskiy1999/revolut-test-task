import { RenderResult, render, act, fireEvent } from "@testing-library/react"
import { getInitialState } from "../../../App.component";
import CurrencySelector from "../../../components/CurrencySelector/currency-selector.component";
import { Currency } from "../../../models/shared.model";

const mockProps = {
    ...getInitialState(),
    account: {
        ...getInitialState().account,
        USD: 123,
    },
    selectedCurrencies: {
        ...getInitialState().selectedCurrencies,
        from: {
            value: 12,
            title: Currency.USD,
        },
    }
}

describe('Currency selector component tests', () => {
    let component: RenderResult;
    const spy = jest.fn();

    beforeEach(() => {
        component = render(<CurrencySelector {...mockProps} onChange={spy} indicator="from" />);
    });

    it('should define component', () => {
        expect(component).toBeDefined();
    });

    it('should call onChange spy when onChange fires', () => {
        const select = component.queryByTestId('currency-selector-from');

        act(() => {
            fireEvent.change(select as Element, { target: { value: Currency.USD } });
        });

        expect(spy).toHaveBeenCalledWith({ indicator: 'from', value: Currency.USD });
    });

    it('should show balance', () => {
        const expectedText = component.queryByText('You have on balance: 123');
 
        expect(expectedText).toBeDefined();
    });
})