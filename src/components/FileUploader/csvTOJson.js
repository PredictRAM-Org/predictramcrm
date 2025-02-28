import Papa from 'papaparse';

export const csvTOJson = async (csvData) =>
  new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const filteredData = results.data.filter((row) =>
          Object.values(row).some((value) => value !== null && value !== undefined && value !== '')
        );
        resolve(filteredData);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
