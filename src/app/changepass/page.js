'use client';
import AdminLayout from '../components/AdminLayout';
import {
    Typography,
    Box,
    TextField,
    Button,
    Grid,
    Paper,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    Container,
    DialogActions
} from '@mui/material';
import * as React from 'react';
import { API_BASE_URL } from '../utils/constants';
import Link from 'next/link';
import md5 from 'js-md5';

export default function ChangepassPage() {
    const lebartextbox = '250px';
    const [username, setUsername] = React.useState('');
    const [iduser, setIduser] = React.useState('');
    const [currentPassword, setCurrentPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmNewPassword, setConfirmNewPassword] = React.useState('');

    const [isUsernameValid, setIsUsernameValid] = React.useState(false);
    const [isCheckingUsername, setIsCheckingUsername] = React.useState(false);

    const [error, setError] = React.useState(null);
    const [success, setSuccess] = React.useState(null);
    const [isSaving, setIsSaving] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);

    const newPasswordRef = React.useRef(null);

    // Fungsi untuk mendapatkan tanggal dan waktu saat ini (dari WargaPage)
    function getCurrentDateTimeFormatted() {
        const now = new Date();
        // Asumsi format: yyyy-MM-dd HH:mm:ss
        return format(now, 'yyyy-MM-dd HH:mm:ss');
    }

    // =======================================================
    // 1. CEK USERNAME
    // =======================================================
    const handleCheckUsername = async () => {
        if (!username) {
            setError('Username tidak boleh kosong.');
            return;
        }

        setIsCheckingUsername(true);
        setError(null);
        setSuccess(null);
        setIsUsernameValid(false);

        const token = localStorage.getItem('auth_token');
        // ASUMSI: API Anda memiliki endpoint untuk memverifikasi keberadaan username
        const url = `${API_BASE_URL}/C_user/check_username`;
        const hashedPassword = md5(currentPassword);
        const bodyData = new URLSearchParams({
            username: username,
            password: hashedPassword
        }).toString();

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    //   'Authorization': `Bearer ${token}`,
                },
                // body: JSON.stringify({ username: username }),
                body: bodyData,

            });

            const jsonResult = await response.json();

            if (response.ok && jsonResult.success) {
                setIsUsernameValid(true);
                setSuccess('Username ditemukan. Silakan masukkan password baru.');
               setTimeout(() => {
                    if (newPasswordRef.current) {
                        newPasswordRef.current.focus();
                    }
                }, 100);
                setIduser(jsonResult.data.id_user);
                console.log("jsonResult.data: ", jsonResult.data);
                console.log("jsonResult.data.id_user: ", jsonResult.data.id_user);


            } else {
                setIsUsernameValid(false);
                setError(jsonResult.message || 'Username tidak ditemukan di database.');
            }
        } catch (e) {
            setError('Koneksi gagal saat memverifikasi username.');
            console.log("ERROR: ", e)
        } finally {
            setIsCheckingUsername(false);

        }
                console.log("ID_USER: ", iduser);

    };

    // =======================================================
    // 2. VALIDASI FORM DAN DIALOG KONFIRMASI
    // =======================================================
    const handleSimpanClick = (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!isUsernameValid) {
            setError('Harap verifikasi Username terlebih dahulu.');
            return;
        }
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setError('Semua field password harus diisi.');
            return;
        }
        if (newPassword.length < 6) {
            setError('Password baru harus minimal 6 karakter.');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setError('Konfirmasi password baru tidak cocok.');
            return;
        }
        if (currentPassword === newPassword) {
            setError('Password baru tidak boleh sama dengan password saat ini.');
            return;
        }

        setOpenDialog(true);
    };

    // =======================================================
    // 3. FUNGSI UPDATE PASSWORD (API CALL)
    // =======================================================
    const handleConfirmChangePassword = async () => {
        setOpenDialog(false);
        setIsSaving(true);
        setError(null);
        setSuccess(null);

        const token = localStorage.getItem('auth_token');
        const operatorId = localStorage.getItem('id_resident');
        const hashedPassword = md5(newPassword);

        // ASUMSI: Endpoint API untuk mengubah password
        const url = `${API_BASE_URL}/C_user/change_password`;

        const dataToSend = {
            id_user: iduser,
            password: hashedPassword,
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(dataToSend),
            });
            console.log("JSON.stringify(dataToSend) ", JSON.stringify(dataToSend))


            const jsonResult = await response.json();

            if (response.ok && jsonResult.success) {
                setSuccess('✅ Password berhasil diubah!');
                // Reset form setelah berhasil
                setUsername('');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
                setIsUsernameValid(false);

            } else {
                setError(jsonResult.message || 'Gagal mengubah password. Pastikan password saat ini benar.');
            }
        } catch (e) {
            setError('Koneksi gagal atau terjadi kesalahan jaringan.');
            console.log("ERROR CHANGE PASSWORD: ", e)

        } finally {
            setIsSaving(false);
        }
    };
    React.useEffect(() => {
    if (iduser) {
        console.log("✅ ID_USER (setelah update): ", iduser);
    }
}, [iduser]);


    // =======================================================
    // TAMPILAN JSX
    // =======================================================
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: '#f4f6f9' // Latar belakang abu-abu muda
            }}
        >
            <Container component="main" maxWidth="sm">
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography variant="h5" gutterBottom align="center">
                        Ganti Password Akun
                    </Typography>
                    <Box component="form" onSubmit={handleSimpanClick} sx={{ mt: 3 }}>

                        {/* Feedback Error/Success */}
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                        <Grid container spacing={2}>
                            {/* Input Username */}
                            <Grid item size={{ xs: 12, sm: 12 }}>
                                <TextField
                                    label="Username"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        setIsUsernameValid(false);
                                        setError(null);
                                        setSuccess(null);
                                    }}
                                    fullWidth
                                    size="small"
                                    required
                                    disabled={isUsernameValid || isSaving}
                                />
                            </Grid>
                            {/* Field Password Saat Ini */}
                            <Grid item size={{ xs: 12, sm: 12 }}>
                                <TextField
                                    label="Password Saat Ini"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    fullWidth
                                    size="small"
                                    required
                                    disabled={isUsernameValid || isSaving}
                                />
                            </Grid>

                            {/* Tombol Cek Username */}
                            <Grid item size={{ xs: 12, sm: 12 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleCheckUsername}
                                    disabled={isCheckingUsername || isUsernameValid || isSaving}
                                    fullWidth
                                    sx={{ height: '100%', bgcolor: '#395886' }}
                                >
                                    {isCheckingUsername ? <CircularProgress size={24} color="inherit" /> : 'Cek'}
                                </Button>
                            </Grid>

                            {/* Status Validasi */}
                            {isUsernameValid && (
                                <Grid item size={{ xs: 12, sm: 12 }}>
                                    <Alert severity="info" sx={{ py: 0.5 }}>Username terverifikasi. Masukkan password.</Alert>
                                </Grid>
                            )}



                            <Typography variant="subtitle2" sx={{ ml: 2, mt: 2, color: 'gray' }}>
                                Masukkan Password Baru:
                            </Typography>

                            {/* Field Password Baru */}
                            <Grid item size={{ xs: 12, sm: 12 }}>
                                <TextField
                                    label="Password Baru"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    fullWidth
                                    size="small"
                                    required
                                    disabled={!isUsernameValid || isSaving}
                                    inputRef={newPasswordRef}
                                />
                            </Grid>

                            {/* Field Konfirmasi Password Baru */}
                            <Grid item size={{ xs: 12, sm: 12 }}>
                                <TextField
                                    label="Konfirmasi Password Baru"
                                    type="password"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    fullWidth
                                    size="small"
                                    required
                                    disabled={!isUsernameValid || isSaving}
                                />
                            </Grid>

                            {/* Tombol Simpan */}
                            <Grid item size={{ xs: 12, sm: 12 }} sx={{ mt: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    disabled={!isUsernameValid || isSaving || isCheckingUsername}
                                    sx={{ bgcolor: '#395886' }}
                                >
                                    {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </Grid>

                        </Grid>
                    </Box>
                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        <Link
                            href="/login" // ⬅️ Arahkan ke halaman ganti password yang baru dibuat
                            passHref // Wajib untuk link Next.js yang dibungkus di MUI
                            style={{ textDecoration: 'none', color: '#395886' }} // Hapus garis bawah default
                        >
                            Kembali Ke Login?
                        </Link>
                    </Typography>
                </Paper>

            </Container>

            {/* DIALOG KONFIRMASI (tetap di luar Box/Container) */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Konfirmasi Perubahan Password</DialogTitle>
                <DialogContent>
                    <Typography>Apakah Anda yakin ingin mengganti password untuk <strong>{username}</strong>?</Typography>
                    <Typography color="error" sx={{ mt: 1 }}>Pastikan Anda mengingat password baru Anda.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="error" disabled={isSaving}>Batal</Button>
                    <Button onClick={handleConfirmChangePassword} color="primary" variant="contained" disabled={isSaving}>
                        Ya, Ganti Password
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}