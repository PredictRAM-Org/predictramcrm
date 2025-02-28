// src/layout/common/notifications-popover.jsx
import { useState } from 'react';
import {
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Typography,
  Divider,
  Button,
  Box,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import NotificationService from 'src/services/Notification.service';
import toast from 'react-hot-toast';

export default function NotificationsPopover() {
  const [open, setOpen] = useState(null);
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data = {} } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => NotificationService.get(),
    select: (res) => ({
      notifications: res?.data?.notifications || [],
      total: res?.data?.total || 0,
    }),
    staleTime: 60000 * 5, // 5 minutes cache
  });

  const { notifications = [] } = data;

  // Mark as read mutation
  const { mutate: markAsRead } = useMutation({
    mutationFn: async (notificationId) => {
      NotificationService.put(notificationId);
    },
    onSuccess: () => {
      // Invalidate notifications query to trigger refetch
      queryClient.invalidateQueries(['notifications']);
    },
    onError: (err) => toast.error(err.message),
  });

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAsRead = (notificationId) => {
    markAsRead(notificationId);
    handleClose();
  };

  return (
    <>
      <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Notifications</Typography>
          {unreadCount > 0 && (
            <Button
              size="small"
              color="primary"
              onClick={() => notifications.forEach((n) => !n.read && markAsRead(n._id))}
            >
              Mark all read
            </Button>
          )}
        </Box>

        <Divider />

        <List sx={{ p: 0, maxHeight: 400, overflow: 'auto' }}>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText primary="No notifications" />
            </ListItem>
          ) : (
            notifications.map((notification) => (
              <ListItem
                key={notification._id}
                sx={{
                  ...(!notification.read && {
                    bgcolor: 'action.selected',
                  }),
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <ListItemIcon>
                  <Iconify
                    icon={
                      notification.type === 'NEW_SUBSCRIBER'
                        ? 'solar:user-plus-bold'
                        : 'solar:chart-bold'
                    }
                    width={24}
                  />
                </ListItemIcon>

                <ListItemText
                  primary={notification.message}
                  secondary={new Date(notification.createdAt).toLocaleString()}
                  primaryTypographyProps={{ variant: 'subtitle2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />

                {!notification.read && (
                  <IconButton size="small" onClick={() => handleMarkAsRead(notification._id)}>
                    <Iconify icon="solar:check-read-bold" width={16} />
                  </IconButton>
                )}
              </ListItem>
            ))
          )}
        </List>
      </Popover>
    </>
  );
}

NotificationsPopover.propTypes = {
  // Add any necessary props here
};
