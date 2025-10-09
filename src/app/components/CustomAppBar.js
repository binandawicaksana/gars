// components/CustomAppBar.js
import { AppBar, Toolbar, Typography, IconButton, Box, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function CustomAppBar({ drawerWidth, handleDrawerToggle }) {
  const router = useRouter();

  const handleLogout = () => {
    // 1. Hapus Token (Sesuai dengan cara Anda menyimpannya)
    localStorage.removeItem('auth_token');
     Cookies.remove('auth_token');
    // Jika Anda menggunakan Cookies, kirim permintaan ke endpoint logout PHP untuk menghapus Cookie

    // 2. Redirect ke halaman login
    router.push('/login');
  };
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        {/* Tombol menu untuk tampilan mobile/kecil */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap component="div">
          Guarding System For Residential Areas
        </Typography>

        {/* Anda bisa menambahkan icon notifikasi atau profil di sini */}
        <Box sx={{ flexGrow: 1 }} />
        {/* <Link href="/profile" passHref style={{ color: 'inherit', textDecoration: 'none' }}>
          <Typography variant="body1">
            Selamat Datang
          </Typography>

        </Link> */}
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}