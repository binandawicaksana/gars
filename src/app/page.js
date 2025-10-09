// app/page.js (Contoh Fetching Data)
'use client';
import * as React from 'react';
import { Card, CardContent, Grid, Typography, CircularProgress, Alert, Box } from '@mui/material';
import AdminLayout from './components/AdminLayout'; // Sesuaikan jalur impor

export default function DashboardPage() {
  const [userFullname, setUserFullname] = React.useState('');
 
  /**
 * @returns {string | null}
 */
function getFullName() {
  // 1. Ambil data JSON (dalam bentuk string) dari localStorage
  const userDataString = localStorage.getItem('user_data');

  if (!userDataString) {
    return null; // Tidak ada data tersimpan
  }

  try {
    // 2. Urai string JSON menjadi objek JavaScript
    const userData = JSON.parse(userDataString);

    // 3. Akses properti 'fullname'
    // Asumsi: struktur data Anda langsung memiliki properti 'fullname'
    if (userData && userData.fullname) {
      return userData.fullname;
    } else {
      return null; // Properti fullname tidak ada
    }
  } catch (error) {
    console.error("Gagal mengurai user_data dari localStorage:", error);
    return null; // Gagal parsing (data rusak)
  }
}

  

  React.useEffect(() => {
        // Karena localStorage hanya tersedia di sisi client (browser), 
        // pastikan Anda memanggilnya di dalam useEffect atau di kondisi is client side.
        const fullname = getFullName();
        if (fullname) {
            setUserFullname(fullname);
        }
    }, []);

  // 3. Tampilkan data yang sudah dimuat
  return (
    <AdminLayout>
      <Typography variant="h4" gutterBottom>
        <p>Halo, Selamat Datang: <strong>{userFullname || 'Pengguna'}</strong></p>
      </Typography>
  
    </AdminLayout>
  );
}