import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Box, ListItemButton, Drawer, List, Typography, Divider, useTheme, useMediaQuery } from '@mui/material';
import { alpha } from '@mui/material/styles';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useSelector } from 'react-redux';

import { getRouteFromRole } from 'src/utils/routeAccess';

import Logo from 'src/components/logo';
import navConfig from './config-navigation';
import AccountPopover from './common/account-popover';
import LanguagePopover from './common/language-popover';

// ----------------------------------------------------------------------

export default function Nav({ openNav, onCloseNav }) {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const user = useSelector((state) => state?.user?.details);

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <>
      
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 , mb: 2 }}>
          <Logo />
        </Box>
      <Box sx={{ px: 2, py: 1 }}>
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: 1,
          p: 1
        }}>

          <input
            type="text"
            placeholder="Search"
            style={{
              border: 'none',
              background: 'none',
              marginLeft: 8,
              outline: 'none',
              width: '100%'
            }}
          />
        </Box>
      </Box>

      <List>
        {getRouteFromRole(user?.role, navConfig).map((item) => (
          <NavItem key={item.title} item={item} />
        ))}
      </List>

      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <AccountPopover />
          <Box sx={{ ml: 1 , mr : 2 }}>
          <Typography variant="body2" noWrap>
            {`${user?.firstName} ${user?.lastName}`}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
            {`${user?.email}`}
          </Typography>
          </Box>
          <LanguagePopover />
        </Box>
      </Box>
    </>
  );

  return (
    <Box component="nav">
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={openNav}
        onClose={onCloseNav}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0,0,0,0.12)',
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          },
        }}
      >
        {renderContent}
      </Drawer>
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------

function NavItem({ item }) {
  const pathname = usePathname();

  const active = item.path === `${pathname.split('/')[1]}`;

  return (
    <ListItemButton
      component={RouterLink}
      href={item.path}
      sx={{
        minHeight: 44,
        borderRadius: 0.75,
        typography: 'body2',
        color: 'text.secondary',
        textTransform: 'capitalize',
        fontWeight: 'fontWeightMedium',
        ...(active && {
          color: 'primary.main',
          fontWeight: 'fontWeightSemiBold',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
          },
        }),
      }}
    >
      <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
        {item.icon}
      </Box>

      <Box component="span">{item.title} </Box>
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};