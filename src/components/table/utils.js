import _ from 'lodash';

export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

export function emptyRows(page, rowsPerPage, arrayLength) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

function descendingComparator(a, b, orderBy) {
  if (a[orderBy] === null) {
    return 1;
  }
  if (b[orderBy] === null) {
    return -1;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function applyFilter({ inputData, comparator, filterName }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (user) => user?.firstName?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}

function getPropByString(obj, propString) {
  // return _.get(obj, propString, "-");
  if (!propString) return obj;

  // eslint-disable-next-line one-var

  const props = propString.split('.');

  let i = 0;
  let iLen;

  for (i = 0, iLen = props.length - 1; i < iLen; i += 1) {
    const prop = props[i];

    const candidate = obj[prop];
    if (candidate !== undefined) {
      obj = candidate;
    } else {
      break;
    }
  }
  return obj[props[i]];
}

export function getTableData(tableConfig, tableData) {
  // const headers = tableConfig?.map((el) => el.label);
  const accessors = tableConfig?.map(({ accessor }) => accessor);

  const accessRow = (data) =>
    accessors?.map((el) => {
      if (typeof el === 'string') return getPropByString(data, el);
      if (typeof el === 'function') return el(data);
      return '-';
    });

  const data = tableData?.map((el, idx) => ({ rowData: accessRow(el, idx), rawData: el }));

  return data;
}

export const applyPagination = (items, page, limit) =>
  items?.slice(page * limit, page * limit + limit);

export const applyFilters = (items, query, properties) =>
  items?.filter((item) => {
    let matches = true;

    if (query) {
      let containsQuery = false;

      properties?.forEach((property) => {
        const data = _.get(item, property, '');

        const dataLowercase =
          typeof data === 'string'
            ? data.toLowerCase()
            : JSON.stringify(data)
                ?.replace(/{|}|"|'/g, '')
                .toLowerCase();

        if (dataLowercase.includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    return matches;
  });
