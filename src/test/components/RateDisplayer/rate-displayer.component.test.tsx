import { RenderResult, render } from "@testing-library/react";
import RateDisplayer from "../../../components/RateDisplayer/rate-displayer.component";
import { Currency } from "../../../models/shared.model";

const mockProps = {
    rates: {
        USD: 1,
        EUR: 1.2,
        GBP: 1.3,
    },
    selectedCurrencies: {
        from: {
            title: Currency.USD,
            value: 10,
        },
        to: {
            title: Currency.EUR,
            value: 11,
        },
    },
};

describe('Rate displayer component tests', () => {
    let component: RenderResult;

    beforeEach(() => {
        component = render(<RateDisplayer {...mockProps} />)
    });

    it('should define component', () => {
        expect(component).toBeDefined();
    });

    it('should display rates', () => {
        const expectedRate = component.queryByText('1 USD - 1.2 EUR');

        expect(expectedRate).toBeDefined();
    });
});