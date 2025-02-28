import React, { useRef } from 'react';

import { Link, Button, Typography } from '@mui/material';

export function CsvUpload({ onInputChange }) {
  const uploadInputRef = useRef(null);

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            my: 3,
          }}
        >
          Upload bulk using CSV file:
        </Typography>
        <input
          ref={uploadInputRef}
          type="file"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          style={{
            display: 'none',
          }}
          onChange={onInputChange}
        />
        <Button
          onClick={() => uploadInputRef.current && uploadInputRef.current.click()}
          variant="outlined"
        >
          Upload
        </Button>
      </div>
      <Link href="/public/demo.csv" download underline="hover">
        <div>Download a demo CSV</div>
      </Link>
    </>
  );
}
