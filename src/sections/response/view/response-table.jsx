import { useQuery } from '@tanstack/react-query';

import cleanObject from 'src/utils/cleanObject';
import { fDateTime } from 'src/utils/format-time';
import { paisaToRupees } from 'src/utils/convert';

import ResponseService from 'src/services/Response.service';

import BaseTable from 'src/components/table/BaseTable';

// ----------------------------------------------------------------------

export default function ResponseTable({ filter }) {
  const tableFormat = [
    { label: 'Created At', accessor: ({ createdAt }) => fDateTime(createdAt) || '-' },
    { label: 'Response', accessor: 'response' },
    { label: 'Status', accessor: ({ status }) => status || 'N/A' },
    { label: 'Type', accessor: ({ marketCall }) => marketCall.type.replace(/_/g, ' ') || '-' },
    {
      label: 'Buy Price',
      accessor: ({ marketCall }) => paisaToRupees(marketCall.buyPrice) || 'N/A',
    },
    {
      label: 'Target Price',
      accessor: ({ marketCall }) => paisaToRupees(marketCall.targetPrice) || 'N/A',
    },
    {
      label: 'Stop Loss Price',
      accessor: ({ marketCall }) => paisaToRupees(marketCall.stopLossPrice) || 'N/A',
    },
  ];

  const { data = [], isLoading } = useQuery({
    queryKey: ['user-response', cleanObject(filter)],
    queryFn: () => ResponseService.get(filter),
    select: (res) => res?.data?.responses || [],
    staleTime: 60000 * 10,
  });

  return (
    <BaseTable
      filter={filter}
      tableData={data}
      loading={isLoading}
      tableDataFormat={tableFormat}
      filterables={['response', 'status', 'marketCall.type']}
    />
  );
}
