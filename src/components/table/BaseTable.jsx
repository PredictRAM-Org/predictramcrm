import { useState } from 'react';

import Card from '@mui/material/Card';
// import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
// import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Scrollbar from 'src/components/scrollbar';

import BaseTableRow from './parts/table-row';
import BaseTableHead from './parts/table-head';
// import TableEmptyRows from './table-empty-rows';
// import TableNoData from './error/not-found-view';
import TableNoData from './parts/table-no-data';
import FetchLoader from '../loader/fetch-loader';
import BaseTableToolbar from './parts/table-toolbar';
import { applyFilters, getTableData, applyPagination } from './utils';
// import { emptyRows, applyFilter, getComparator } from './utils';

// ----------------------------------------------------------------------

export default function BaseTable({
  tableData,
  tableDataFormat,
  filterables,
  actions = null,
  showPagination = true,
  loading = false,
  cardStyle = {},
  filter = {},
  setFilter,
  customPagination = false,
  customDocCount = 0,
}) {
  const [page, setPage] = useState(customPagination ? filter?.page : 0);

  const [query, setQuery] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(customPagination ? filter?.limit : 5);

  const handleChangePage = (event, newPage) => {
    if (customPagination) {
      setFilter({ ...filter, page: newPage, limit: rowsPerPage });
    }
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    if (customPagination) {
      setFilter({ ...filter, page: 0, limit: parseInt(event.target.value, 10) });
    }

    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilter = (event) => {
    // setPage(0);
    setQuery(event.target.value);
  };

  const filteredData = applyFilters(tableData, query, filterables);

  const paginatedData = customPagination
    ? filteredData
    : applyPagination(filteredData, page, rowsPerPage);

  const displayData = getTableData(tableDataFormat, paginatedData);

  const notFound = !filteredData?.length && !!query;

  return (
    <Card sx={{ ...cardStyle }}>
      <BaseTableToolbar filter={query} onFilter={handleFilter} filterables={filterables} />
      {loading && <FetchLoader />}
      {!loading && (
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table>
              <BaseTableHead actions={actions} headLabel={tableDataFormat} />

              <TableBody>
                {displayData?.map((row, idx) => (
                  <BaseTableRow
                    key={idx}
                    actions={actions}
                    row={row}
                    handleClick={(event) => console.log(row)} // TODO: do something on click of table row
                  />
                ))}

                {notFound ||
                  (displayData?.length === 0 && (
                    <TableNoData query={query} blankTableData={displayData?.length === 0} />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      )}
      {showPagination && (
        <TablePagination
          page={customPagination ? filter?.page : page}
          component="div"
          count={customPagination ? customDocCount : filteredData?.length}
          rowsPerPage={customPagination ? filter?.limit : rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Card>
  );
}
