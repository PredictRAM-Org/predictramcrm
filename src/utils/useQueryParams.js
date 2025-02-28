import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import cleanObject from './cleanObject';

export default function useQueryParams() {
  const navigate = useNavigate();
  const location = useLocation();
  let search = location.search.slice(1);

  const setQueryParams = (params) => {
    search = new URLSearchParams(cleanObject(params)).toString();
    navigate({ pathname: location.pathname, search: `?${search}` });
  };

  return [
    useMemo(() => cleanObject(Object.fromEntries(new URLSearchParams(search))), [search]),
    setQueryParams,
  ];
}
