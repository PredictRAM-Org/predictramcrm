import React from 'react';

import { MARKET_CALL_TYPES } from 'src/enums';

import BrandAutocomplete from './BrandAutocomplete';

function MarketCallDurationAutoComplete({
  onChange,
  value,
  name,
  label,
  placeholder,
  size,
  noLabel,
  lg,
  md,
  multiple,
}) {
  const options = Object.keys(MARKET_CALL_TYPES).map((key) => ({
    label: MARKET_CALL_TYPES[key],
    value: key,
  }));
  return (
    <BrandAutocomplete
      size={size ?? 'medium'}
      label={label ?? 'Select Market Call Type'}
      noLabel={noLabel}
      multiple={multiple}
      placeholder={placeholder ?? 'Select Market Call Type...'}
      onChange={onChange}
      value={value}
      name={name ?? 'marketcall'}
      options={options}
      lg={lg}
      md={md}
    />
  );
}

export default MarketCallDurationAutoComplete;
