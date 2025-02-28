import React, { useState } from 'react';
import { Modal, Box, Typography, Button, Input, CircularProgress } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function ProfilePicEditModal({
  open,
  onClose,
  onImageUpload,
  loading,
  uploadPercent,
}) {
  const [image, setImage] = useState(null);

  const formik = useFormik({
    initialValues: {
      avatar: '',
    },
    validationSchema: Yup.object({
      avatar: Yup.mixed().required('An image file is required'),
    }),
    onSubmit: (values) => {
      onImageUpload(image);
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      formik.setFieldValue('avatar', file);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: 3,
          borderRadius: 2,
          boxShadow: 24,
          minWidth: 400,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Edit Profile Picture
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Box>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              sx={{ display: 'none' }}
              id="file-input"
            />
            <label htmlFor="file-input">
              <Button variant="outlined" component="span" sx={{ mb: 2 }}>
                Choose Image
              </Button>
            </label>

            {image && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <img
                  src={URL.createObjectURL(image)}
                  alt="Avatar Preview"
                  style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }}
                />
              </Box>
            )}
          </Box>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
              <CircularProgress variant="determinate" value={uploadPercent} />
              <Typography>{uploadPercent}% Uploaded</Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" type="submit" disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Upload Image'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}
