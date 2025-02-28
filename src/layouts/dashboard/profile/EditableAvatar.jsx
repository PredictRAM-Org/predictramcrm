import React, { useState } from 'react';
import { Box, Avatar, IconButton, Tooltip } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';
import ImageService from 'src/services/Image.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ProfileService from 'src/services/Profile.service';
import ProfilePicEditModal from './ProfilePicEditModal';

export default function EditableAvatar({ profile, onEdit }) {
  const [hover, setHover] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);

  const queryClient = useQueryClient();

  const handleAvatarClick = () => {
    setOpenModal(true); // Open modal when avatar is clicked
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const { mutate: handelSave } = useMutation({
    mutationFn: (uploadedImageUrl) => ProfileService.put(profile?.id, { image: uploadedImageUrl }),
    onError: (err) => toast.error(err.message),
    onSuccess: () => {
      queryClient.invalidateQueries(['profile']);
      handleCloseModal();
    },
  });

  const handleImageUpload = async (newImage) => {
    try {
      setLoading(true);
      const totalSize = newImage.size;
      const uploadedImageUrl = await ImageService.upload(newImage, (progress) => {
        const loadSize = progress?.loadedBytes;
        const percent = Number((loadSize / totalSize) * 100).toFixed(1);
        setUploadPercent(percent);
      });

      if (uploadedImageUrl) handelSave(uploadedImageUrl);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
      setUploadPercent(0);
    }
  };

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          display: 'inline-block',
          '&:hover': {
            cursor: 'pointer',
          },
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Avatar
          src={
            profile?.image ||
            `https://ui-avatars.com/api/?name=${profile?.firstName}+${profile?.lastName}`
          }
          alt={`${profile?.firstName} ${profile?.lastName}`}
          sx={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            objectFit: 'cover',
          }}
          onClick={handleAvatarClick}
        >
          {`${profile?.firstName} ${profile?.lastName}`.charAt(0).toUpperCase()}
        </Avatar>
        {hover && (
          <Tooltip title="Edit Avatar" placement="top">
            <IconButton
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                },
              }}
              onClick={handleAvatarClick}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Avatar Edit Modal */}
      <ProfilePicEditModal
        open={openModal}
        onClose={handleCloseModal}
        onImageUpload={handleImageUpload}
        loading={loading}
        uploadPercent={uploadPercent}
      />
    </>
  );
}
