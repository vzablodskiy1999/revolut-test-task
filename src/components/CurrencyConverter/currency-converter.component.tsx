import React from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';
import { State } from '../../models/shared.model';
import { CurrencyConverterChangeEvent } from '../../models/currency-converter.model';

interface Props extends State {
    indicator: 'from' | 'to',
    onChange: (event: CurrencyConverterChangeEvent) => void;
};

const CurrencyConverter: React.FC<Props> = (props: Props) => {
    const { value, title } = props.selectedCurrencies[props.indicator];
    const handleInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
        props.onChange({
            indicator: props.indicator,
            value: event.target.value,
        });
    };

    return (
        <>
            <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text>{title}</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl data-testid={"currency-converter-" + props.indicator} as="input" onChange={handleInput} value={value} />
            </InputGroup>
        </>
    );
};

export default CurrencyConverter;