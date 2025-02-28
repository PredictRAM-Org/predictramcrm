import { useQuery } from '@tanstack/react-query';

import UserService from 'src/services/User.service';

import BrandAutocomplete, { createOptionsFromArr } from './BrandAutocomplete';

function UserAutocomplete({
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
  enabled,
}) {
  const { data = [] } = useQuery({
    queryKey: ['user-autocomplete', filter],
    queryFn: () => UserService.get(filter),
    select: (res) => res?.data || [],
    // staleTime: 60000 * 10,
    enabled,
  });

  return (
    <BrandAutocomplete
      size={size ?? 'medium'}
      label={label ?? 'User Select'}
      noLabel={noLabel}
      placeholder={placeholder ?? 'Select user...'}
      onChange={onChange}
      value={value}
      name={name ?? 'user'}
      options={createOptionsFromArr(data?.user || [], labelKey ?? 'email', pickKey ?? 'id')}
      lg={lg}
      md={md}
      multiple={multiple}
    />
  );
}

export default UserAutocomplete;
