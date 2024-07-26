import { blue, indigo } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: blue[500],
            contrastText: '#000000',
            "100":'#E8EAF6',
        },
        secondary: {
            main: '#BDBDBD',
        },
        info: {
            main : '#333f50'
        },
        background: {
            default: '#f4f5fa',
            paper: '#ffffff',
        },
        text: {
            primary: '#000000',
            secondary: '#BDBDBD'
        },
    },
    typography: {
        fontFamily: '"malgun","Roboto", "Helvetica", "Arial", sans-serif',
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
            fontSize: '1rem',
            // fontWeight: 'bold'
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
            main : '#333f50'
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

export { lightTheme, darkTheme };