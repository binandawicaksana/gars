// app/page.jsx
'use client'; // WAJIB ada di baris pertama karena menggunakan hooks (useState)

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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Grid,
  MenuItem,
} from '@mui/material';
import * as React from "react";
import { useState, useEffect } from 'react';

export default function ServoControl() {
  const [status, setStatus] = useState('Siap');
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState({
      motor_status: 'IDLE', // MOVING atau IDLE
      posisi_kiri: false,   // true/false
      posisi_kanan: false,  // true/false
  });
  const fetchStatus = async () => {
    try {
      // Panggil Route Handler /api/status
      const response = await fetch('/admin/pagar/api/status');
      const data = await response.json();
      
      if (response.ok && !data.error) {
        // Update state status alat
        setCurrentStatus(data);
        // Update status UI utama berdasarkan status motor
        setStatus(data.motor_status === 'MOVING' 
            ? 'Motor SEDANG BERGERAK' 
            : 'Motor SIAP/DIAM');
      } else {
        // Jika gagal, tampilkan pesan error
        setStatus(`Gagal update status: ${data.message || 'Error jaringan.'}`);
        setCurrentStatus({ motor_status: 'UNKNOWN' });
      }
    } catch (error) {
      // Kesalahan jaringan total (misalnya Next.js server down)
      setStatus('Terjadi kesalahan jaringan saat mengambil status.');
    }
  };
  useEffect(() => {
    // Panggil segera saat komponen dimuat
    fetchStatus(); 
    
    // Atur interval polling (misalnya setiap 2000 ms = 2 detik)
    const intervalId = setInterval(fetchStatus, 2000); 

    // Fungsi cleanup: membersihkan interval saat komponen dilepas
    return () => clearInterval(intervalId);
  }, []);

  const handleMove = async (direction) => {
    // Memastikan input direction valid
    if (direction !== 'kiri' && direction !== 'kanan') {
      setStatus('Kesalahan: Arah tidak valid.');
      return;
    }

    setLoading(true);
    setStatus(`Menggerakkan ke ${direction.toUpperCase()}...`);

    try {
      // Panggil Route Handler (API Route internal Next.js)
      // Endpoint: /api/servo?direction=kiri atau /api/servo?direction=kanan
      const response = await fetch(`/admin/pagar/api/servo?direction=${direction}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setStatus(`✅ Berhasil: ${data.message}`);
      } else {
        // Tangani kegagalan dari server proxy atau ESP32
        setStatus(`❌ Gagal: ${data.message || 'Respons tidak berhasil.'}`);
      }
    } catch (error) {
      console.error('Terjadi kesalahan jaringan/fetch:', error);
      setStatus('❌ Terjadi kesalahan jaringan. Cek koneksi ke Next.js API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h1>Kontrol Motor DC (ESP32)</h1>
      <div style={{ border: '1px solid #ddd', padding: '15px', margin: '20px 0', backgroundColor: '#f9f9f9' }}>
        <h2>STATUS ALAT SAAT INI</h2>
        <p style={{ fontWeight: 'bold', color: currentStatus.motor_status === 'MOVING' ? 'orange' : 'green' }}>
          MOTOR: {currentStatus.motor_status}
        </p>
        <p>Posisi Kanan Terkunci: {currentStatus.posisi_kanan ? 'YA' : 'TIDAK'}</p>
        <p>Posisi Kiri Terkunci: {currentStatus.posisi_kiri ? 'YA' : 'TIDAK'}</p>
      </div>
      <p style={{ fontSize: '1.2em', margin: '20px 0' }}>Status: <strong>{status}</strong></p>
      
      <div style={{ margin: '30px 0' }}>
        <button 
          onClick={() => handleMove('kiri')} 
          disabled={loading}
          style={buttonStyle(loading)}
        >
          ⬅️ KIRI
        </button>
        <button 
          onClick={() => handleMove('kanan')} 
          disabled={loading}
          style={{ ...buttonStyle(loading), marginLeft: '20px' }}
        >
          KANAN ➡️
        </button>
      </div>
      
      {loading && <p style={{ color: '#0070f3' }}>⏳ Tunggu sebentar, ESP32 sedang beraksi...</p>}
    </div>
    </AdminLayout>
    
  );
}

// Fungsi sederhana untuk gaya tombol
const buttonStyle = (loading) => ({
  padding: '12px 25px',
  fontSize: '18px',
  cursor: loading ? 'not-allowed' : 'pointer',
  backgroundColor: loading ? '#ccc' : '#0070f3',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  transition: 'background-color 0.3s',
});