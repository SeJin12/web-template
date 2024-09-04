import { blue, deepOrange, grey, indigo, orange, red, yellow } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: blue[500],
            contrastText: '#ffffff',
            "100": '#E8EAF6',
        },
        secondary: {
            main: '#BDBDBD',
        },
        info: {
            main: '#333f50'
        },
        error: {
            main: red[500]
        },
        warning: {
            main: indigo[600]
        },
        background: {
            default: '#ffffff', // f4f5fa
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
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 'bold',
            lineHeight: 1.3,
        },
        h3: {
            fontSize: '1.2rem',
            fontWeight: 'bold',
            lineHeight: 1.4,
        },
        h4: {
            fontSize: '0.9rem',
            lineHeight: 1.5,
        },
        h5: {
            fontSize: '0.8rem',
            fontWeight: 'bold',
            lineHeight: 1.6,
        },
        h6: {
            fontSize: '0.8rem',
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
                    borderRadius: '12px'
                },
            },
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: blue[600],
            contrastText: '#ffffff'
        },
        secondary: {
            main: '#4d4d4d',
        },
        info: {
            main: '#333f50'
        },
        error: {
            main: red[500]
        },
        warning: {
            main: yellow[500]
        },
        background: {
            default: '#24292e',
            paper: '#3c3c47'
        },
        text: {
            primary: '#ffffff',
            secondary: '#BDBDBD'
        },
    },
    typography: {
        fontFamily: 'malgun, "GmarketSansTTFMedium",Arial, sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 'bold',
            lineHeight: 1.2,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 'bold',
            lineHeight: 1.3,
        },
        h3: {
            fontSize: '1.2rem',
            fontWeight: 'bold',
            lineHeight: 1.4,
        },
        h4: {
            fontSize: '0.9rem',
            lineHeight: 1.5,
        },
        h5: {
            fontSize: '0.9rem',
        },
        h6: {
            fontSize: '0.9rem',
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
                    borderRadius: '12px'
                },
            },
        },
    },
});

export { darkTheme, lightTheme };

