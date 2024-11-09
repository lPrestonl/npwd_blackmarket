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
    MuiCardHeader: {
      styleOverrides: {
        root: {
          fontSize: '1.5rem', // Adjust size as needed
          padding: '10px',
        },
        title: {
          fontSize: '1rem', // Title font size
        },
        subheader: {
          fontSize: '.7rem', // Subtitle font size
        },
      },
    },
  },
};

export const themes: Record<'dark' | 'light', ThemeOptions> = {
  light: lightTheme,
  dark: darkTheme,
};
