import { useState } from 'react';
import toast from 'react-hot-toast';

import { Box, Typography, CircularProgress } from '@mui/material';

import ImageService from 'src/services/Image.service';

import Iconify from '../iconify';

function ImageUploader({ setImage, imagePath, index = 1, height }) {
  const [uploadPercent, setUploadPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const handelImageChoose = async (e) => {
    const image = e.target.files[0];
    if (!image) return;
    handelDeleteImage(e);

    const totalSize = image.size;
    try {
      setLoading(true);
      const uploadedImageUrl = await ImageService.upload(image, (progress) => {
        const loadSize = progress?.loadedBytes;
        const percent = Number((loadSize / totalSize) * 100).toFixed(1);
        setUploadPercent(percent);
      });

      setImage(uploadedImageUrl);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
      setUploadPercent(0);
    }
  };

  const handelDeleteImage = async (e) => {
    e.preventDefault();
    if (imagePath) {
      try {
        await ImageService.delete(imagePath);
        setImage('');
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  return (
    <Box>
      {!imagePath && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ebf4f2',
            height: '100px',
            borderRadius: 2,
            cursor: 'pointer',
          }}
          component="label"
          htmlFor={`image-uploader-${index}`}
        >
          {!loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
              <img alt="upload-icon" src="/assets/icons/image_upload.png" />
              <Typography
                variant="caption"
                sx={{ color: 'text.disabled', fontSize: '15px', fontWeight: 'bold' }}
              >
                Choose Stock Analysis Image for Market Call
              </Typography>
            </Box>
          )}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
              <CircularProgress variant="determinate" value={uploadPercent} />
              <Typography>{uploadPercent}% Uploaded</Typography>
            </Box>
          )}
        </Box>
      )}
      {imagePath && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgcolor="#ebf4f2"
          p={2}
          borderRadius={2}
          position="relative"
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <img alt="market-call" height={height || 500} src={imagePath} />
          {isHover && (
            <Box
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              bgcolor="rgba(0, 0, 0, 0.3)"
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius={2}
              gap={2}
            >
              <Box
                border={2}
                p={1}
                borderRadius={100}
                color="white"
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ cursor: 'pointer' }}
                component="label"
                htmlFor={`image-uploader-${index}`}
              >
                <Iconify icon="mdi:image-edit-outline" width={50} color="white" />
              </Box>
              <Box
                border={2}
                p={1}
                color="white"
                borderRadius={100}
                display="flex"
                justifyContent="center"
                alignItems="center"
                onClick={handelDeleteImage}
                sx={{ cursor: 'pointer' }}
              >
                <Iconify icon="mdi:image-remove-outline" width={50} color="white" />
              </Box>
            </Box>
          )}
        </Box>
      )}
      <Box>
        <input
          id={`image-uploader-${index}`}
          onClick={(e) => {
            e.target.value = '';
          }}
          style={{ display: 'none' }}
          alt="market-call-image"
          type="file"
          accept="image/*"
          onChange={handelImageChoose}
        />
      </Box>
    </Box>
  );
}

export default ImageUploader;
