import React from "react";
import { Form } from "react-bootstrap";
import { Currency, State } from "../../models/shared.model";
import { CurrencyCardChangeEvent } from "../../models/currency-card.model";
import { getNumberWithLeadingZeros } from "../../utils/currencies.util";

interface Props extends State {
    indicator: 'from' | 'to';
    onChange: (event: CurrencyCardChangeEvent) => void;
};

const CurrencySelector: React.FC<Props> = (props: Props) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange({
            indicator: props.indicator,
            value: event.target.value as Currency,
        });
    };

    return (
        <>
            <Form>
                <Form.Group>
                    <Form.Label>Select currency</Form.Label>
                    <Form.Control data-testid={'currency-selector-' + props.indicator} as="select" size="lg" custom value={props.selectedCurrencies[props.indicator].title} onChange={handleChange}>
                        {Object.keys(props.rates).map((rate: string) => (
                            <option key={rate}>
                                {rate}
                            </option>
                        ))}
                    </Form.Control>
                    <Form.Text muted>
                        You have on balance: {getNumberWithLeadingZeros(props.account[props.selectedCurrencies[props.indicator].title])}
                    </Form.Text>
                </Form.Group>
            </Form>
        </>
    )
};

export default CurrencySelector;
