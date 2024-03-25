import React from 'react';
import { createTheme, ThemeProvider, Container, Typography } from '@mui/material';

// Создаем тему с шрифтом Montserrat
const theme = createTheme({
  typography: {
    fontFamily: [
      'Montserrat',
      '"Segoe UI"',
    ].join(','),
  },
});

export const Page404 = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Typography variant="h1" component="h1" sx={{ fontSize: '4rem', mb: 4 }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ textAlign: 'center' }}>
          Упс, такой страницы не существует
        </Typography>
      </Container>
    </ThemeProvider>
  );
};
