// app/ThemeRegistry.js (Ini contoh struktur yang disarankan)
'use client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

export default function ThemeRegistry({ children }) {
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline untuk reset CSS MUI (seperti normalize.css) */}
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
