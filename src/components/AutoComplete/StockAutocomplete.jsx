import React from 'react';

import { hedgeCompany } from './hedgeComapny';
import BrandAutocomplete from './BrandAutocomplete';

function StockAutocomplete({
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
  const options = hedgeCompany.map((option) => ({
    label: option,
    value: option,
  }));
  return (
    <BrandAutocomplete
      size={size ?? 'medium'}
      label={label ?? 'Stock Select'}
      noLabel={noLabel}
      multiple={multiple}
      placeholder={placeholder ?? 'Select value...'}
      onChange={onChange}
      value={value}
      name={name ?? 'stock'}
      options={options}
      lg={lg}
      md={md}
    />
  );
}

export default StockAutocomplete;
