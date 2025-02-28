import * as XLSX from 'xlsx';

import cleanObject from 'src/utils/cleanObject';

export const xlsxToJson = (xlsx) => {
  const workbook = XLSX.read(xlsx, { type: 'binary' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  const filterData = [];
  jsonData.forEach((row) => {
    const obj = cleanObject(row);
    if (Object.keys(obj).length > 0) {
      filterData.push(row);
    }
  });
  return filterData;
};
