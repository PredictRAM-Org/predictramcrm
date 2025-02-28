import { Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

export default function Dropdown({ options, onChange, value, label, nolabel = false }) {
  return (
    <div>
      {!nolabel && <Typography fontWeight="bold">{label}</Typography>}
      <TextField select size="small" value={value} onChange={onChange}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
}
