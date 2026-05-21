import React from 'react';
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  createTheme,
  ThemeProvider,
} from '@mui/material';

const drawerWidth = 350;

const bluTheme = createTheme({
  palette: {
    primary: {
      main: '#0088cc',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f4f4f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#222222',
      secondary: '#707579',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#222222',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

interface MainLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  title?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  sidebar,
  children,
  title = 'Chattr',
}) => {
  return (
    <ThemeProvider theme={bluTheme}>
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            borderBottom: '1px solid #e6e6e6',
            boxShadow: 'none',
          }}
        >
          <Toolbar sx={{ minHeight: '56px !important' }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ fontSize: '1.1rem' }}
            >
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                borderRight: '1px solid #e6e6e6',
                background: '#ffffff',
              },
            }}
            open
          >
            {sidebar}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            mt: '56px',
            height: 'calc(100vh - 56px)',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f4f4f5',
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default MainLayout;
