import React from 'react';

import BrandAutocomplete from './BrandAutocomplete';

function BolleanAutoComplete({
  onChange,
  value,
  name,
  label,
  placeholder,
  ENUM = [],
  size,
  noLabel,
  lg,
  md,
  multiple,
}) {
  const obj = { YES: true, NO: false };
  const options = Object.keys(obj).map((key) => ({
    label: key,
    value: obj[key],
  }));
  return (
    <BrandAutocomplete
      size={size ?? 'medium'}
      label={label ?? 'Boolean Select'}
      noLabel={noLabel}
      multiple={multiple}
      placeholder={placeholder ?? 'Select value...'}
      onChange={onChange}
      value={value}
      name={name ?? 'boolSelect'}
      options={options}
      lg={lg}
      md={md}
    />
  );
}

export default BolleanAutoComplete;
