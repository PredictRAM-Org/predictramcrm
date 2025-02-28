import * as XLSX from 'xlsx';

const createWorkbook = (data, format) => {
  const ws = XLSX.utils.json_to_sheet(
    data.map((item) => {
      const row = {};
      format.forEach((f) => {
        if (typeof f.accessor === 'function') {
          row[f.Header] = f.accessor(item);
        } else if (f.accessor.includes('.')) {
          const keys = f.accessor.split('.');
          let value = item;
          for (let i = 0; i < keys.length; i += 1) {
            if (value[keys[i]] === undefined || value[keys[i]] === null) {
              value = null;
              break;
            }
            value = value[keys[i]];
          }
          row[f.Header] = value;
        } else {
          row[f.Header] = item[f.accessor];
        }
      });
      return row;
    })
  );

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  return wb;
};
const handleExportExcel = (data, excelFormat, excelFileName) => {
  const wb = createWorkbook(data, excelFormat); // Generate Excel workbook
  const excelBuffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${excelFileName}.xlsx`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
export default handleExportExcel;
