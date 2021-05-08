import React, { useMemo } from 'react';
import { Rates, SelectedCurrency } from '../../models/shared.model';

interface Props {
    rates: Rates,
    selectedCurrencies: {
        from: SelectedCurrency,
        to: SelectedCurrency,
    },
};

const RateDisplayer: React.FC<Props> = (props: Props) => {
    const exchangeRate = useMemo(() => {
        return (props.rates[props.selectedCurrencies.to.title] / props.rates[props.selectedCurrencies.from.title]).toFixed(4);
    }, [props]);

    return (
        <div>
            1 {props.selectedCurrencies.from.title} - {exchangeRate} {props.selectedCurrencies.to.title}
        </div>
    );
};

export default RateDisplayer;