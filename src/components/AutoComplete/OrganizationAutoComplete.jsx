import { useQuery } from '@tanstack/react-query';

import OrganizationService from 'src/services/Organization.service';

import BrandAutocomplete, { createOptionsFromArr } from './BrandAutocomplete';

function OrganizationAutocomplete({
  onChange,
  value,
  name,
  label,
  placeholder,
  size,
  noLabel,
  labelKey,
  filter = {},
  pickKey,
  lg,
  md,
  multiple,
}) {
  const { data = [] } = useQuery({
    queryKey: ['organization-autocomplete', filter],
    queryFn: () => OrganizationService.get(filter),
    select: (res) => res?.data || [],
    staleTime: 60000 * 10,
  });

  return (
    <BrandAutocomplete
      size={size ?? 'medium'}
      label={label ?? 'Organization Select'}
      multiple={multiple}
      noLabel={noLabel}
      placeholder={placeholder ?? 'Select Organization...'}
      onChange={onChange}
      value={value}
      name={name ?? 'organization'}
      options={createOptionsFromArr(data, labelKey ?? 'name', pickKey ?? 'id')}
      lg={lg}
      md={md}
    />
  );
}

export default OrganizationAutocomplete;
