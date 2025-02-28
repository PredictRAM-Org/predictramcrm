// import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
// import Checkbox from '@mui/material/Checkbox';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
// import TableSortLabel from '@mui/material/TableSortLabel';

// import { visuallyHidden } from './utils';

// ----------------------------------------------------------------------

export default function BaseTableHead({ headLabel, actions }) {
  // const onSort = (property) => (event) => {
  //   onRequestSort(event, property);
  // };

  return (
    <TableHead>
      <TableRow>
        {headLabel?.map((headCell) => (
          <TableCell
            key={headCell.label}
            align={headCell.align || 'left'}
            sx={{ width: headCell.width, minWidth: headCell.minWidth, background: headCell.color }}
          >
            {headCell.label}
          </TableCell>
        ))}
        {actions && <TableCell align="center">Actions</TableCell>}
      </TableRow>
    </TableHead>
  );
}
