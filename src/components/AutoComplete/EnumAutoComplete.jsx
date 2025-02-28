import React from 'react';

import BrandAutocomplete from './BrandAutocomplete';

function EnumAutocomplete({
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
  const options = ENUM.map((option) => ({
    label: option,
    value: option,
  }));
  return (
    <BrandAutocomplete
      size={size ?? 'medium'}
      label={label ?? 'ENUM Select'}
      noLabel={noLabel}
      multiple={multiple}
      placeholder={placeholder ?? 'Select value...'}
      onChange={onChange}
      value={value}
      name={name ?? 'enumSelect'}
      options={options}
      lg={lg}
      md={md}
    />
  );
}

export default EnumAutocomplete;
