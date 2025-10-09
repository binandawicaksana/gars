// app/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    // 💡 Gunakan variable CSS yang telah didefinisikan di layout.js
    fontFamily: 'var(--font-poppins), Arial, sans-serif', 
  },
  palette: {
    primary: {
      main: '#1976D2', // Warna utama Anda
    },
  },
  // Anda bisa kustomisasi typography, components, dll.
});

export default theme;