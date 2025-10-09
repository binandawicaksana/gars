// components/AdminLayout.js
'use client'; 

import * as React from 'react';
import { Box, CssBaseline } from '@mui/material';
import CustomAppBar from './CustomAppBar'; // Akan kita buat di langkah 2
import CustomSidebar from './CustomSidebar'; // Akan kita buat di langkah 3

// Konstanta lebar sidebar
const drawerWidth = 240;

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* 1. Navbar */}
      <CustomAppBar 
        drawerWidth={drawerWidth} 
        handleDrawerToggle={handleDrawerToggle} 
      />
      
      {/* 2. Sidebar (Navigasi) */}
      <CustomSidebar 
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      
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