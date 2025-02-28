import React from 'react';

import { RESPONSE_STATUS } from 'src/enums';

import BrandAutocomplete from './BrandAutocomplete';

function ResponseStatusAutoComplete({
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
  const options = Object.keys(RESPONSE_STATUS).map((key) => ({
    label: RESPONSE_STATUS[key],
    value: key,
  }));
  return (
    <BrandAutocomplete
      size={size ?? 'medium'}
      label={label ?? 'Select status'}
      noLabel={noLabel}
      multiple={multiple}
      placeholder={placeholder ?? 'Select status...'}
      onChange={onChange}
      value={value}
      name={name ?? 'status'}
      options={options}
      lg={lg}
      md={md}
    />
  );
}

export default ResponseStatusAutoComplete;
