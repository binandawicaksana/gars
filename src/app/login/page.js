// app/login/page.js
'use client';
import * as React from 'react';
// Import Grid untuk layout dua kolom dan Paper untuk background form
import { Container, Box, Typography, TextField, Button, Alert, Grid, Paper, InputLabel, InputAdornment, IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import md5 from 'js-md5';
import Cookies from 'js-cookie';
import Image from 'next/image';
import PersonIcon from '@mui/icons-material/PersonOutline';
import LockIcon from '@mui/icons-material/LockOutlined';

export default function LoginPage() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const hashedPassword = md5(password);

    const bodyData = new URLSearchParams({
      username: username,
      password: hashedPassword
    }).toString();
    const url = '/api/v1/C_user/login';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: bodyData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("position_code:",data.data.position_code);
        console.log("Respon Data:",data);
        if (data.data.position_code==0||data.data.position_code==1){
        Cookies.set('auth_token', data.token, {
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict'
        });
        console.log("Status:", data.token);
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.data)); 
        localStorage.setItem('id_resident', data.data.id_resident); 
        console.log("id_resident:", data.data.id_resident);
        router.push('/');
        } else {
          setError('Silahkan login di Aplikasi Gars Mobile');
        }
        // Simpan token ke Cookies
        
      } else {
        setError(data.message || 'Login gagal. Cek kredensial Anda.');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };
  // React.useEffect(() => {
  //   const token = localStorage.getItem('auth_token');
  //   if (token) {
  //     // Jika token ditemukan, arahkan ke dashboard.
  //     // Dengan 'replace', browser tidak akan menyimpan halaman login di history.
  //     router.replace('/'); 
  //   }
  // }, [router]);

  return (
    // Gunakan Box sebagai container utama, atur tinggi layar penuh
    <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50' }}>

      <Grid
        container
        component="main"
        sx={{
          height: '90vh',
          maxWidth: 1200,
          boxShadow: 3,
          borderRadius: 2,
          overflow: 'hidden',
          display: 'flex',
        }}>
        <Grid
          item
          size={{ xs: false, sm: false, md: 6 }}
          // xs={false} // ✅ PERBAIKAN: Sembunyikan sepenuhnya di layar Extra Small (<600px)
          // sm={false} // ✅ PERBAIKAN: Sembunyikan sepenuhnya di layar Small (600px - 900px)
          // md={6}     // Tetap tampil 50% di layar Desktop (>=900px)
          component={Paper}
          elevation={6}
          square
          sx={{
            height: '100%',
            backgroundColor: 'white', // Pastikan background putih
            display: { xs: 'none', md: 'flex' }, // Tambahkan ini untuk memastikan elemen disembunyikan
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Konten Gambar */}
          <Box>
            <Image
              src="/images/home_image3.png"
              alt="Logo GARS"
              width={500}
              height={500}
              style={{ margin: '0 auto', display: 'block' }}
            />
          </Box>
        </Grid>



        <Grid
          item
          size={{ xs: 12, sm: 12, md: 6 }}
          // xs={12}
          // sm={12}
          // md={6}
          component={Paper}
          elevation={6}
          square
          sx={{
            height: '100%',
            // bgcolor:'#638ecb',
          }}
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',

            }}
          >
            <Typography component="h1" variant="h4" gutterBottom>
              Hallo,
            </Typography>
            <Typography component="h1" variant="h4" gutterBottom>
              Selamat Datang
            </Typography>
            <Typography component="h1" variant="h4" gutterBottom>
              Kembali!
            </Typography>
            <Box component="form" noValidate onSubmit={handleLogin} sx={{ mt: 3, width: '100%', }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  <div dangerouslySetInnerHTML={{ __html: error }} />
                </Alert>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                // slotProps.htmlInput={{
                //     startAdornment: <PersonIcon sx={{ color: 'grey.500', mr: 1 }} />,
                // }}
                slotProps={{
                  input: {
                    // Tempatkan properti InputProps di sini
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'action.active', mr: 1 }} />
                      </InputAdornment>
                    ),
                  }
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                slotProps={{
                  input: {
                    // Ikon Kunci di sisi KIRI (startAdornment)
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: 'action.active', mr: 1 }} />
                      </InputAdornment>
                    ),
                  }
                }}

              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3, mb: 2, py: 1.5, borderRadius: '50px', bgcolor: '#395886',
                  '&:hover': {
                    bgcolor: '#2f4870', // Warna sedikit lebih gelap saat mouse di atas tombol
                  }
                }}
                disabled={loading}
              >
                {loading ? 'Memuat...' : 'Masuk'}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}