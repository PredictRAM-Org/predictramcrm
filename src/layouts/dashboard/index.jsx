import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { createTheme } from '@mui/material/styles';

import Nav from './nav';
import Header from './header';

// ----------------------------------------------------------------------

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
});

export default function DashboardLayout({ children }) {
  const [openNav, setOpenNav] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onOpenNav={() => setOpenNav(true)} />
      <Box sx={{ display: 'flex', flexGrow: 1, mt: '64px' }}> {/* Adjust mt to match header height */}
        <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            ml: { sm: openNav ? '240px' : 0 },
            width: { sm: openNav ? `calc(100% - 240px)` : '100%' },
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
            onClick={() => setOpenNav(false)} 
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};