import { useQuery } from '@tanstack/react-query';

import MarketcallService from 'src/services/Marketcall.service';

import BrandAutocomplete, { createOptionsFromArr } from './BrandAutocomplete';

function MarketCallAutoComplete({
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
    queryKey: ['market-autocomplete', filter],
    queryFn: () => MarketcallService.get(filter),
    select: (res) => res?.data?.marketCall || [],
    staleTime: 60000 * 10,
  });

  return (
    <BrandAutocomplete
      size={size ?? 'medium'}
      label={label ?? 'Marketcall Select'}
      multiple={multiple}
      noLabel={noLabel}
      placeholder={placeholder ?? 'Select Marketcall...'}
      onChange={onChange}
      value={value}
      name={name ?? 'Marketcall'}
      options={createOptionsFromArr(data, labelKey ?? 'title', pickKey ?? '_id')}
      lg={lg}
      md={md}
    />
  );
}

export default MarketCallAutoComplete;
