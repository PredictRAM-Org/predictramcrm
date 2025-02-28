import React from 'react';
import { useSelector } from 'react-redux';

import { ROLES } from 'src/enums';

import BrandAutocomplete from './BrandAutocomplete';

function RoleAutocomplete({
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
  const user = useSelector((state) => state?.user?.details);
  const roles = Object.keys(ROLES);
  const options = (
    user?.role === ROLES.ANALYST
      ? roles.filter((r) => r !== ROLES.SUPER_ADMIN)
      : roles.slice(roles.indexOf(user?.role))
  ).map((option) => ({
    label: option,
    value: option,
  }));
  return (
    <BrandAutocomplete
      size={size ?? 'medium'}
      label={label ?? 'Role Select'}
      noLabel={noLabel}
      multiple={multiple}
      placeholder={placeholder ?? 'Select value...'}
      onChange={onChange}
      value={value}
      name={name ?? 'role'}
      options={options}
      lg={lg}
      md={md}
    />
  );
}

export default RoleAutocomplete;
