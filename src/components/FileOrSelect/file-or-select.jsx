import _ from 'lodash';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Box, Alert, Button, Collapse, Typography } from '@mui/material';

import Iconify from '../iconify';
import FileFormat from '../FileFormat/file-format';
import FileUploader from '../FileUploader/file-uploader';
import handleExportCSV from '../FileDownloader/csvDownloader';
import handleExportExcel from '../FileDownloader/xlsxDownloader';
import BrandAutocomplete, { createOptionsFromArr } from '../AutoComplete/BrandAutocomplete';

function FileOrSelect({
  label,
  placeholder,
  onChange,
  value,
  name,
  pickKey,
  labelKey,
  filter = {},
  dataSelectKey,
  api,
  apiEndPoint = '',
  gid = 0,
  showCSV = false,
  showSample = false,
  showXLSX = false,
  csvKey,
  csvName,
  reactQuerykey,
  apiEnable = true,
}) {
  const [selectActive, setSelectActive] = useState(true);
  const [uploadActive, setUploadActive] = useState(true);

  const { data: apiData = [] } = useQuery({
    queryKey: [reactQuerykey, filter],
    queryFn: () => api.doGet(`${api?._url}${apiEndPoint}`, filter),
    enabled: apiEnable,
    select: (res) => (dataSelectKey ? res.data[dataSelectKey] : res.data),
  });

  return (
    <Box>
      <Typography sx={{ mb: 1 }} fontWeight="bold">
        {label ?? 'Choose or Updload data'}:
      </Typography>
      <Collapse in={selectActive}>
        <BrandAutocomplete
          noLabel
          placeholder={placeholder ?? 'Select data...'}
          onChange={(x, data) => {
            onChange(data);
            setUploadActive(!(data.length > 0));
          }}
          value={value}
          multiple
          name={name ?? 'data'}
          options={createOptionsFromArr(apiData, labelKey, pickKey)}
        />
      </Collapse>
      <Collapse in={selectActive === uploadActive}>
        <Box marginY="10px" display="flex" justifyContent="center" alignItems="center">
          <Typography fontWeight="bold">OR</Typography>
        </Box>
      </Collapse>
      <Collapse in={uploadActive}>
        <Box>
          <FileUploader
            setData={(data) => {
              let csvData = [];

              const filteredData = data.map((d) => d[csvKey]);
              csvData = apiData
                ?.filter((el) => filteredData.includes(_.get(el, labelKey)))
                ?.map((el) => _.get(el, pickKey));

              console.log(csvData);
              onChange(csvData);
              setSelectActive(!(csvData.length > 0));
            }}
          />
          <FileFormat
            gid={gid}
            showCSV={showCSV}
            showSample={showSample}
            showXLSX={showXLSX}
            sx={{ mt: 1 }}
          >
            <Button
              variant="outlined"
              rel="noreferrer"
              endIcon={<Iconify icon="material-symbols:sim-card-download-rounded" />}
              onClick={() =>
                handleExportCSV(
                  apiData,
                  [
                    {
                      Header: csvKey,
                      accessor: labelKey,
                    },
                  ],
                  `${csvName || 'DATA'}_${new Date().toLocaleString()}`
                )
              }
            >
              Download Avilable Clients (CSV)
            </Button>
            <Button
              variant="outlined"
              rel="noreferrer"
              endIcon={<Iconify icon="material-symbols:sim-card-download-rounded" />}
              onClick={() =>
                handleExportExcel(
                  apiData,
                  [
                    {
                      Header: csvKey,
                      accessor: labelKey,
                    },
                  ],
                  `${csvName || 'DATA'}_${new Date().toLocaleString()}`
                )
              }
            >
              Download Avilable Clients (EXCEL)
            </Button>
          </FileFormat>
        </Box>
      </Collapse>
      <Box sx={{ mt: 2 }}>
        {value.length > 0 && (
          <Alert severity="info">
            You have uploaded total {value.length} {name || 'data'}
          </Alert>
        )}
      </Box>
    </Box>
  );
}

export default FileOrSelect;
