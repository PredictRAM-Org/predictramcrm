import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

import { Avatar } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import cleanObject from 'src/utils/cleanObject';

import OrganizationService from 'src/services/Organization.service';

// import Iconify from 'src/components/iconify';
import BaseTable from 'src/components/table/BaseTable';

// ----------------------------------------------------------------------

export default function OrganizationTable({ filterQuery }) {
  const tableFormat = [
    {
      label: 'Name',
      accessor: ({ name, avatarUrl }) => (
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt={name} src={avatarUrl} />
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Stack>
      ),
    },
    { label: 'Contact', accessor: 'contact' },
    { label: 'Email', accessor: 'email' },
  ];

  const { data, isLoading } = useQuery({
    queryKey: ['organizations', filterQuery],
    queryFn: () => OrganizationService.get(cleanObject(filterQuery)),
    onError: (err) => toast.error(err.message),
    select: (res) => res?.data || [],
  });

  return (
    <BaseTable
      filter={filterQuery}
      tableData={data}
      loading={isLoading}
      tableDataFormat={tableFormat}
      filterables={['name', 'contact', 'email']}
      // actions={
      //   <div>
      //     <MenuItem>
      //       <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
      //       Edit
      //     </MenuItem>

      //     <MenuItem sx={{ color: 'error.main' }}>
      //       <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
      //       Delete
      //     </MenuItem>
      //   </div>
      // }
    />
  );
}
