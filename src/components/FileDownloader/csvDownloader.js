const createCSV = (data, format) => {
  let csvContent = '';
  const headers = format.map((item) => item.Header);
  csvContent += `${headers.join(',')}\n`;
  data.forEach((item) => {
    const row = [];
    format.forEach((f) => {
      if (typeof f.accessor === 'function') {
        if (typeof f.accessor(item) !== 'object') {
          row.push(f.accessor(item));
        } else {
          row.push('-');
        }
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
        row.push(value);
      } else {
        row.push(item[f.accessor]);
      }
    });

    const csvRowTxt = `${JSON.stringify(row)}\n`;

    csvContent += `${csvRowTxt.slice(csvRowTxt.indexOf('[') + 1, csvRowTxt.lastIndexOf(']'))}\n`;
  });
  return csvContent;
};

const handleExportCSV = (data, csvFormat, csvFileName) => {
  const csvContent = createCSV(data, csvFormat);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${csvFileName}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default handleExportCSV;
