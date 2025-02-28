import { uniqueId } from 'lodash';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import { useRouter } from 'src/routes/hooks';

import { fToNow } from 'src/utils/format-time';

import { MARKET_CALL_TYPES } from 'src/enums';
import SocketService from 'src/services/Socket.service';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const [notifications, setNotifications] = useState([]);
  const user = useSelector((state) => state.user?.details);
  const totalUnRead = notifications?.filter((item) => item.isUnRead === true).length;

  const [open, setOpen] = useState(null);

  useEffect(() => {
    SocketService.connect().catch((e) => console.error(e.message));
    SocketService.addEventListener('market-call-received', ({ id, message, data }) => {
      if (data?.owner !== user?.id) {
        setNotifications((prev) => [
          {
            id: uniqueId(),
            link: `/market-call/details/${id}`,
            title: `New ${MARKET_CALL_TYPES[data?.type]} Call for ${data?.stockType} ${
              data?.symbol
            } stock`,
            createdAt: new Date(),
            avatar: `/assets/icons/navbar/ic_market.svg`,
            isUnRead: true,
          },
          ...prev,
        ]);
      }
    });
    SocketService.addEventListener('response-received', ({ id, message }) => {
      setNotifications((prev) => [
        {
          id: uniqueId(),
          link: `/market-call/details/${id}/response`,
          avatar: `/assets/icons/navbar/ic_response.svg`,
          title: message,
          createdAt: new Date(),
          isUnRead: true,
        },
        ...prev,
      ]);
    });
    SocketService.addEventListener('response-status-update', ({ id, message }) => {
      setNotifications((prev) => [
        {
          id: uniqueId(),
          link: `/market-call/details/${id}`,
          avatar: `/assets/icons/navbar/ic_status_update.svg`,
          title: message,
          createdAt: new Date(),
          isUnRead: true,
        },
        ...prev,
      ]);
    });
    return () => {
      SocketService.disconnect();
    };
  }, [user?.id]);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isUnRead: false,
      }))
    );
  };

  return (
    <>
      <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen}>
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton
                color="primary"
                onClick={handleMarkAllAsRead}
                setNotifications={setNotifications}
              >
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List disablePadding>
            {notifications.slice(0, 2).map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                setOpen={setOpen}
                setNotifications={setNotifications}
              />
            ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />
      </Popover>
    </>
  );
}

function NotificationItem({ notification, setOpen, setNotifications }) {
  const router = useRouter();
  const { avatar, title } = renderContent(notification);

  const handelOnClick = (link) => {
    router.push(link);
    setOpen(null);
    setNotifications((prev) =>
      prev?.map((noti) => {
        console.log(noti);
        if (noti?.id === notification?.id) {
          return { ...noti, isUnRead: false };
        }
        return noti;
      })
    );
  };

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected',
        }),
      }}
      onClick={() => handelOnClick(notification?.link)}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Box>
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                display: 'flex',
                alignItems: 'center',
                color: 'text.disabled',
              }}
            >
              <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
              {fToNow(notification.createdAt)}
            </Typography>
          </Box>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = <Typography variant="subtitle2">{notification.title}</Typography>;

  if (notification.type === 'order_placed') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_package.svg" />,
      title,
    };
  }
  if (notification.type === 'order_shipped') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_shipping.svg" />,
      title,
    };
  }
  if (notification.type === 'mail') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_mail.svg" />,
      title,
    };
  }
  if (notification.type === 'chat_message') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_chat.svg" />,
      title,
    };
  }
  return {
    avatar: notification.avatar ? <img alt={notification.title} src={notification.avatar} /> : null,
    title,
  };
}
