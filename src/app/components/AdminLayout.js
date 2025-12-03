// components/AdminLayout.js
'use client'; 

import * as React from 'react';
import { Box, CssBaseline } from '@mui/material';
import CustomAppBar from './CustomAppBar'; // Akan kita buat di langkah 2
import CustomSidebar from './CustomSidebar'; // Akan kita buat di langkah 3
import CustomSidebarAdmin from './CustomSidebarAdmin'; // Akan kita buat di langkah 3
import CustomSidebarSatpam from './CustomSidebarSatpam'; // Akan kita buat di langkah 3



// Konstanta lebar sidebar
const drawerWidth = 240;

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [userPosition, setUserPosition] = React.useState('');

  function getPositionCode() {
  // 1. Ambil data JSON (dalam bentuk string) dari localStorage
  const positionCodeString = localStorage.getItem('position_code');
  if (!positionCodeString) return null;
    
    try {
        // Asumsi data yang tersimpan adalah string "99" atau hanya string '99'
        // Jika yang tersimpan adalah string '99', JSON.parse akan gagal atau mengembalikan string. 
        // Lebih aman langsung menggunakan string, tapi kita harus membandingkan dengan string.
        // Mari kita asumsikan yang tersimpan adalah string '99'
        return positionCodeString;
    } catch (e) {
        console.error("Gagal parse position_code dari localStorage", e);
        return null; 
    }
}

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  React.useEffect(() => {
          const positioncode = getPositionCode();
    if (positioncode) {
      // Pastikan positioncode adalah nilai yang ingin Anda simpan, misalnya '99'
      setUserPosition(positioncode); 
      // ✅ Log variabel lokal yang nilainya sudah pasti terbaru
      // console.log('Position Code from storage:', positioncode); 
    }
      }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* 1. Navbar */}
      <CustomAppBar 
        drawerWidth={drawerWidth} 
        handleDrawerToggle={handleDrawerToggle} 
      />

     
      
      {/* 2. Sidebar (Navigasi) */}
      {/* <CustomSidebar 
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      /> */}
      {userPosition === '99' ? (
    // JIKA POSISI ADALAH ADMIN ('99')
    <CustomSidebarAdmin 
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
    />
) : userPosition === '3' || userPosition === '4' ? (
    // JIKA POSISI ADALAH SATPAM ('3' atau '4')
    <CustomSidebarSatpam // ✅ Panggil komponen Sidebar Satpam yang baru
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
    />
) : (
    // JIKA POSISI ADALAH DEFAULT/LAINNYA (misalnya Warga)
    <CustomSidebar 
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
    />
)}
      
      {/* 3. Konten Utama */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3, // Padding untuk konten
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: '64px', // Sesuaikan dengan tinggi AppBar
          backgroundColor: '#f4f6f9', // Warna latar belakang AdminLTE style
        }}
      >
        {children} {/* Di sinilah konten halaman Anda akan di-inject */}
      </Box>
    </Box>
  );
}