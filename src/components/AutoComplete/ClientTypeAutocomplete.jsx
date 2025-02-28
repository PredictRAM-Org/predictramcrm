import React from 'react';

import { CLIENT_TYPE } from 'src/enums';

import BrandAutocomplete from './BrandAutocomplete';

function ClientTypeAutocomplete({
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
  const options = Object.keys(CLIENT_TYPE).map((key) => ({
    label: CLIENT_TYPE[key],
    value: key,
  }));
  return (
    <BrandAutocomplete
      size={size ?? 'medium'}
      label={label ?? 'Select Client Type'}
      noLabel={noLabel}
      multiple={multiple}
      placeholder={placeholder ?? 'Select Client Type...'}
      onChange={onChange}
      value={value}
      name={name ?? 'client_type'}
      options={options}
      lg={lg}
      md={md}
    />
  );
}

export default ClientTypeAutocomplete;
