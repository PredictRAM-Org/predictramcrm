import { useState } from 'react';
import toast from 'react-hot-toast';

import { Box, FormLabel, Typography } from '@mui/material';

import Iconify from '../iconify';
import { csvTOJson } from './csvTOJson';
import { xlsxToJson } from './xlsxTOJson';

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / 1024 ** i).toFixed(2))} ${units[i]}`;
}

const fileTypeToImg = {
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '/assets/icons/xls_icon.png',
  'text/csv': '/assets/icons/csv_icon.png',
};

const validateFile = (requiredFields, json) => {
  const submittedFields = Object?.keys(json[0]);

  const valid = requiredFields?.every((item) => submittedFields?.includes(item));
  if (!valid) toast.error('Required fields are not present');
};

function FileUploader({ setData, requiredFields = [] }) {
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFilesize] = useState('');
  const [fileType, setFileType] = useState('');

  const onSelect = (e) => {
    const reader = new FileReader();

    const file = e.target.files[0];

    if (!file) return;
    setFileSelected(true);

    setFileName(file?.name);
    setFilesize(formatFileSize(file?.size));
    setFileType(file?.type);

    reader.onload = async (event) => {
      let data = [];
      if (file?.type === 'text/csv') {
        data = await csvTOJson(event.target.result);
      } else {
        data = xlsxToJson(event.target.result);
      }
      console.log(data);
      setData(data);
      if (requiredFields.length > 0) {
        validateFile(requiredFields, data);
      }
    };
    if (file?.type === 'text/csv') {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  const handelCancelFile = (e) => {
    e.preventDefault();
    setFileSelected(false);
    setData([]);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#ebf4f2',
        border: 1,
        borderRadius: 3,
        padding: 3,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'dashed',
        cursor: fileSelected ? 'default' : 'pointer',
      }}
      htmlFor={fileSelected ? '' : 'excel-upload'}
      component={FormLabel}
    >
      <input
        accept=".xlsx"
        onClick={(e) => {
          e.target.value = '';
        }}
        type="file"
        style={{ display: 'none' }}
        id="excel-upload"
        onChange={onSelect}
      />
      {fileSelected ? (
        <Box
          bgcolor="white"
          p={2}
          borderRadius={2}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          position="relative"
        >
          <Iconify
            onClick={handelCancelFile}
            sx={{
              color: 'red',
              position: 'absolute',
              top: 0,
              right: 0,
              cursor: 'pointer',
              pointerEvents: 'auto',
            }}
            icon="material-symbols:cancel"
          />
          <img alt={fileName} src={fileTypeToImg[fileType]} height={50} />
          <Typography>{`${fileName} (${fileSize})`}</Typography>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography>Click to select file</Typography>
          <Typography variant="p">(file type : .xlsx )</Typography>
        </Box>
      )}
    </Box>
  );
}

export default FileUploader;
