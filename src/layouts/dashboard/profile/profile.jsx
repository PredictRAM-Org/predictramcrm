import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Avatar } from '@mui/material';
import ProfileEditModal from 'src/components/modal/profile/profile-edit-modal';
import { useQuery } from '@tanstack/react-query';
import ProfileService from 'src/services/Profile.service';
import { useParams, Navigate } from 'react-router-dom'; // Import Navigate
import ProfileMarketCallCards from 'src/sections/profile/view/profile-market-call-cards';
import { useSelector } from 'react-redux';
import EditableAvatar from './EditableAvatar';

// Helper function to check if an id is a valid MongoDB ObjectId
const isValidObjectId = (id) => /^[a-fA-F0-9]{24}$/.test(id);

export default function Profile() {
  const { id } = useParams();
  const [edit, setEdit] = useState(false);
  const [filter, setFilter] = useState(null);
  const [isRedirect, setIsRedirect] = useState(false); // Track if we need to redirect

  // Access the user from Redux store
  const user = useSelector((state) => state.user.details);

  // Fetch the profile data
  const { data: profile = {}, isLoading: profileLoading } = useQuery({
    queryKey: ['market-call', id],
    queryFn: async () => {
      const { data } = await ProfileService.get({
        [isValidObjectId(id) ? '_id' : 'username']: id, // Use _id if MongoDB ObjectId, else use username
      });
      return data;
    },
    select: (res) => res?.profile,
  });

  // Update the filter when the profile data changes
  useEffect(() => {
    if (profile?.id) {
      setFilter({
        page: 0,
        limit: 5,
        createdBy: profile.id, // Set createdBy using the profile ID
      });
    }
  }, [profile]);

  useEffect(() => {
    if (!profile && !profileLoading) {
      setIsRedirect(true); // Redirect to 404 page if no profile is found
    }
  }, [profile, profileLoading]);

  if (isRedirect) {
    return <Navigate to="/404" />;
  }

  return (
    <>
      <Box sx={{ width: '100%', mt: 2, mb: 2 }}>
        <ProfileEditModal open={edit} handleClose={() => setEdit(false)} profile={profile} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'flex-start' },
            mb: 4,
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          {user?.id === profile?.id ? (
            <EditableAvatar profile={profile} onEdit={() => setEdit(true)} />
          ) : (
            <Avatar
              src={
                profile?.image ||
                `https://ui-avatars.com/api/?name=${profile?.firstName}+${profile?.lastName}`
              }
              alt={`${profile?.firstName} ${profile?.lastName}`}
              sx={{
                width: { xs: 100, md: 120 },
                height: { xs: 100, md: 120 },
                borderRadius: '50%',
                objectFit: 'cover',
                mb: { xs: 2, md: 0 },
              }}
            >
              {`${profile?.firstName} ${profile?.lastName}`.charAt(0).toUpperCase()}
            </Avatar>
          )}

          <Box sx={{ ml: { md: 3 } }}>
            <Typography variant="h4" gutterBottom>
              {profile?.firstName} {profile?.lastName}
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
              {profile?.description}
            </Typography>
            {user?.id === profile?.id && (
              <Box
                sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}
              >
                {!profileLoading && (
                  <Button variant="contained" color="primary" onClick={() => setEdit(true)}>
                    Edit Profile
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Box>
        <Box sx={{ borderBottom: 2, borderColor: 'divider', mt: 4 }} />
      </Box>
      {filter && <ProfileMarketCallCards filter={filter} setFilter={setFilter} />}
    </>
  );
}
