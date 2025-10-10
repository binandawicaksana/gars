// app/users/page.js
'use client';
import AdminLayout from '../../components/AdminLayout';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Box,
  Button
} from '@mui/material';
import * as React from 'react';
import { API_BASE_URL } from '../../utils/constants';
import { redirect } from 'next/navigation';


export default function UsersPage() {
  const [userData, setUserData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  if (typeof window !== 'undefined') {
    const storedCode = localStorage.getItem('position_code');
    if (storedCode !== '99') { 
      redirect('/'); 
      // return null;
    }
  }

  React.useEffect(() => {
    const fetchData = async () => {
      const url = API_BASE_URL + '/C_detailuser/get_detail_user';
      const token = localStorage.getItem('auth_token');

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token}`,
          },
        });
        const jsonResult = await response.json();
        if (response.ok && jsonResult.success) {
          setUserData(jsonResult.data);
        } else {
          setError(jsonResult.message || 'Gagal mengambil data pengguna.');
        }
      } catch (e) {
        setError('Koneksi gagal atau terjadi kesalahan jaringan.');
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }
  if (error) {
    return (
      <AdminLayout>
        <Alert severity="error" sx={{ m: 3 }}>
          Error: {error}
        </Alert>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Typography variant="h4" gutterBottom>
        Manajemen Data Pengguna
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Button size="small" variant="outlined" color="success">Tambah Data</Button>

        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>ID User</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>ID Resident</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userData.map((user) => (
                <TableRow
                  key={user.id_user}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {user.id_user}
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.id_resident}</TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" sx={{ mr: 1 }}>Edit</Button>
                    <Button size="small" variant="outlined" color="error">Hapus</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </AdminLayout>
  );
}