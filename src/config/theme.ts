import { blue, purple } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: purple[500],
            contrastText: '#F6F6F6',
            "100": '#E8EAF6',
        },
        secondary: {
            main: '#BDBDBD',
        },
        info: {
            main: '#333f50'
        },
        background: {
            default: '#f5f5f5', // f4f5fa
            paper: '#ffffff',
        },
        text: {
            primary: '#000000',
            secondary: '#5D5D5D'
        },
    },
    typography: {
        fontFamily: 'Arial, sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 'bold',
            lineHeight: 1.2,
            letterSpacing: '0.1rem',
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 'bold',
            lineHeight: 1.3,
            letterSpacing: '0.1rem',
        },
        h3: {
            fontSize: '0.9rem',
            fontWeight: 'bold',
            lineHeight: 1.4,
            letterSpacing: '0.1rem',
        },
        h4: {
            fontSize: '0.9rem',
            lineHeight: 1.5,
            letterSpacing: '0.1rem',
        },
        h5: {
            fontSize: '0.8rem',
            fontWeight: 'bold',
            lineHeight: 1.6,
            letterSpacing: '0.1rem',
        },
        h6: {
            fontSize: '0.8rem',
            letterSpacing: '0.1rem',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
        },
        subtitle1: {
            fontSize: '1rem',
            fontWeight: 'bold',
            lineHeight: 1.5,
        },
        subtitle2: {
            fontSize: '0.875rem',
            fontWeight: '500',
            lineHeight: 1.5,
        },
        caption: {
            fontSize: '0.75rem',
            lineHeight: 1.5,
        },
        overline: {
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            lineHeight: 1.5,
        },
        button: {
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            fontWeight: 'bold',
        },
    },
    spacing: 8,
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: blue[500],
            contrastText: '#ffffff'
        },
        secondary: {
            main: '#4d4d4d',
        },
        info: {
            main: '#333f50'
        },
        background: {
            default: '#272727',
            paper: '#454545'
        },
        text: {
            primary: '#ffffff',
            secondary: '#BDBDBD'
        },
    },
    typography: {
        fontFamily: '"gmarket","Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
        },
        h2: {
            fontSize: '2rem',
        },
        h3: {
            fontSize: '1.3rem',
            fontWeight: 'bold'
        },
        h4: {
            fontSize: '0.9rem',
            fontWeight: 'bold'
        },
        h5: {
            fontSize: '0.8rem'
        },
        fontSize: 14
    },
    spacing: 8,
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
    },
});

export { darkTheme, lightTheme };

