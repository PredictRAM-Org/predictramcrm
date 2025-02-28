import _ from 'lodash';
import React, { useState, useEffect, useCallback } from 'react';

import { Box, Chip, Grid, Avatar, TextField, Autocomplete } from '@mui/material';

function BrandAutocomplete({
  label,
  placeholder,
  options,
  fullWidth,
  multiple,
  value,
  onChange,
  name,
  disabled,
  noLabel = false,
  xs,
  md,
  ...rest
}) {
  const getDefaultValue = useCallback(
    () =>
      multiple
        ? options?.filter((option) => value?.includes(option?.value))
        : options?.find((el) => el?.value === value),
    [options, value, multiple]
  );

  const [_value, _setValue] = useState(multiple ? [] : {});

  const _onChange = (e, selectedValue) => {
    _setValue(selectedValue);

    const values = multiple ? selectedValue?.map((el) => el?.value) : selectedValue?.value;

    onChange?.(name, values);
  };

  useEffect(() => {
    _setValue(getDefaultValue());
  }, [getDefaultValue, options]);

  return (
    <Grid item xs={xs ?? 12} md={md ?? 12}>
      {!noLabel && (
        <Box>
          <b>{label}</b>
        </Box>
      )}
      <Autocomplete
        {...rest}
        multiple={multiple}
        filterSelectedOptions={multiple}
        sx={{ m: 0 }}
        onChange={_onChange}
        value={_value}
        options={options}
        disabled={disabled}
        defaultValue={getDefaultValue()}
        renderOption={(props, o) => (
          <li {...props} key={o.value}>
            {o.avatar && (
              <Avatar
                sx={{
                  mr: 1,
                }}
                src={o.avatar}
              />
            )}
            {o.label}
          </li>
        )}
        getOptionLabel={(o) => o.label}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            name={name}
            fullWidth={fullWidth || true}
            InputLabelProps={{
              shrink: true,
            }}
            placeholder={placeholder}
          />
        )}
        renderTags={(members, getTagProps) =>
          members.map((ev, index) => (
            <Chip
              key={ev.label}
              label={ev.label}
              {...getTagProps({ index })}
              avatar={ev.avatar && <Avatar src={ev.avatar} />}
            />
          ))
        }
      />
    </Grid>
  );
}

const createOption = (label, value) => ({ label, value });

const createOptionsFromArr = (arr, labelString, valueString) =>
  arr?.map((el) => createOption(_.get(el, labelString, ''), _.get(el, valueString, '')));

export { createOption, createOptionsFromArr };

export default BrandAutocomplete;
