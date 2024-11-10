import { common, green, purple } from '@mui/material/colors';
import { ThemeOptions } from '@mui/material';

export const APP_PRIMARY_COLOR = purple[900];

export const LIGHT_APP_TEXT_COLOR = common.white;
export const DARK_APP_TEXT_COLOR = common.black;

export const lightTheme: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: APP_PRIMARY_COLOR,
      dark: green[700],
      light: green[300],
      contrastText: LIGHT_APP_TEXT_COLOR,
    },
    secondary: {
      main: '#d32f2f',
      light: '#eb4242',
      dark: '#941212',
      contrastText: LIGHT_APP_TEXT_COLOR,
    },
    success: {
      main: '#2196f3',
      contrastText: LIGHT_APP_TEXT_COLOR,
    },
  },
};

export const darkTheme: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: APP_PRIMARY_COLOR,
      dark: green[700],
      light: green[300],
      contrastText: LIGHT_APP_TEXT_COLOR,
    },
    secondary: {
      main: '#d32f2f',
      light: '#eb4242',
      dark: '#941212',
      contrastText: LIGHT_APP_TEXT_COLOR,
    },
    success: {
      main: '#2196f3',
      contrastText: LIGHT_APP_TEXT_COLOR,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          padding: '5px',
          borderRadius: '12px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)', 
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'scale(1.02)', // Scales up on hover
          },
        },
      },
    },
    
    MuiCardActionArea: {
      styleOverrides: {
        root: {
          cursor: 'pointer',
          transition: 'transform 0.3s ease, background-color 0.3s ease',
          '&:hover': {
            transform: 'scale(1.01)',
            backgroundColor: '#444', // Slightly darkens on hover
            boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          fontSize: '1.5rem',
          padding: '10px',
        },
        title: {
          fontSize: '1rem',
        },
        subheader: {
          fontSize: '0.8rem',
        },
      },
    },
  },
};

export const themes: Record<'dark' | 'light', ThemeOptions> = {
  light: lightTheme,
  dark: darkTheme,
};
