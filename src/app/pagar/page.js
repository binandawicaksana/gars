// app/page.jsx
'use client'; // WAJIB ada di baris pertama karena menggunakan hooks (useState)

import AdminLayout from '../components/AdminLayout';
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
import { API_BASE_URL } from '../utils/constants';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';

export default function ServoControl() {
  const lebartextbox = '300px';
  const [residentialCombobox, setresidentialCombobox] = React.useState(true);
  const [residentialIdOptions, setresidentialIdOptions] = React.useState([]);
  const [loadingresidentialId, setLoadingresidentialId] = React.useState(true);
  const [residentialId, setresidentialId] = React.useState("");
  const [idResident, setidResident] = React.useState("");


  const [qrCode, setQrCode] = React.useState('');

  const [loadingQR, setLoadingQR] = React.useState(false);
  const inputRef = React.useRef(null);
  const [error, setError] = React.useState(null);
  const [dataValid, setDataValid] = React.useState(false);
  const timeoutRef = React.useRef(null);

  const [status, setStatus] = useState('-');
  const [loading, setLoading] = useState(false);
  const [IP_ESP, setIP_ESP] = React.useState("");
  const [currentStatus, setCurrentStatus] = useState({
    motor_status: 'IDLE', // MOVING atau IDLE
    posisi_kiri: false,   // true/false
    posisi_kanan: false,  // true/false
  });
  const fetchDeviceIP = async () => {
    const bodyData = new URLSearchParams({
      device_id: "ARDUINO_001"
    }).toString();
    // const bodyData = `username=${username}&password=${hashedPassword}`;
    const url = API_BASE_URL + '/C_device/get_ip';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: bodyData,
      });
      console.log("bodyData:", bodyData);
      const data = await response.json();
      console.log("responseData:", data);

      if (response.ok) {
        setIP_ESP(data.ip_address);
        console.log("IP ESP:", IP_ESP);
      } else {
        setError(data.message || 'Error');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi get IP.');
    } finally {
      // setLoading(false);
    }
  };
  const fetchStatus = async () => {
    try {
      // Panggil Route Handler /api/status
      const response = await fetch('/pagar/api/status');
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
      const response = await fetch(`/pagar/api/servo?direction=${direction}&ip_address=${IP_ESP}`);
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
  const initialFormData = {
    id_guest: "",
    id_resident: "",
    name_guest: "",
    nik_guest: "",
    total_guest: "",
    vehicle_code: "",
    guests_come: "",
    guests_leaving: "",
    information: "",
    qrcode: "",
    created_date: "",
    validate_rt: "",
    validate_rt_date: "",
    validate_security: "",
    validate_security_date: "",
    residential_id: "",
    fullname: "",
    house_number: "",
    rt: "",
    rw: "",
    vehicle_name: "",
    rt_name: "",
    security_name: ""
  };
  const [formData, setFormData] = React.useState(initialFormData);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    console.log("handleInputChange", e.target);
    console.log("handleInputChange", e.target.name);
    if (e.target.name === 'residential_id') {
      // fetchHistoryScan(e.target.value);
      setresidentialId(e.target.value);
      console.log("setresidentialId", residentialId);

    }
  };
  const handleQrCodeChange = (e) => {
    const value = e.target.value;
    setQrCode(value);
    console.log("QRCODE", value);
    console.log("Residential ID: ", residentialId);


    // 1. Bersihkan timer yang lama (agar tidak memicu pengecekan jika masih ada input)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 2. Atur timer baru untuk memicu pengecekan setelah jeda singkat (misalnya 300ms)
    // Jeda ini memastikan seluruh string QR code sudah dimasukkan scanner.
    timeoutRef.current = setTimeout(() => {
      // Panggil fungsi pengecekan dengan nilai akhir
      checkQrCodeData(value);
    }, 300);
  };
  const checkQrCodeData = async (code) => {
    if (!code) return;

    setLoading(true);
    setError(null);
    setDataValid(false);

    const token = localStorage.getItem('auth_token');
    // ASUMSI: Endpoint API Anda untuk memvalidasi QR code
    const url = `${API_BASE_URL}/C_guest/get_guest_byqrcode`;
    const residentialID = localStorage.getItem('residential_id');

    try {
      const bodyData = new URLSearchParams({
      qrcode: code, residential_id: residentialId
    }).toString();

    //  const bodyData = {
    //     'qrcode': qrCode, 
    //     'residential_id': residentialId
    //   };
      console.log("bodyData: ", bodyData);
      console.log("bodyData2: ", JSON.stringify(bodyData));


      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          // 'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        // body: JSON.stringify(bodyData),
        body: bodyData,

      });

      const jsonResult = await response.json();

      if (response.ok && jsonResult.success) {
        // Tampilkan dialog "Data Valid"
        setDataValid(true);
        handleMove('kiri');
      console.log("PAGAR TERBUKA");


      } else {
        setError(jsonResult.message || 'QR Code tidak valid atau tidak ditemukan.');
      }
      // setDataValid(true);
      // handleMove('kiri');
      // if (timeoutRef.current) {
      //   clearTimeout(timeoutRef.current);
      // }
      // timeoutRef.current = setTimeout(() => {
      //   // Panggil fungsi pengecekan dengan nilai akhir
      //   // checkQrCodeData(value);
      handleCloseDialog();
      //   handleMove('kanan');

      // }, 2000);
    } catch (e) {
      setError('Koneksi gagal atau terjadi kesalahan jaringan saat cek data.');
       console.log("Error: ",e);
    } finally {
      setLoading(false);
      setQrCode(''); // Bersihkan input setelah selesai
    }
  };
  const handleCloseDialog = () => {
    setDataValid(false);
    // Fokus otomatis akan diaktifkan melalui useEffect
  };
  const fetchResidentialIdOptions = async () => {
    const token = localStorage.getItem('auth_token');
    // Ganti URL ini dengan endpoint API Anda untuk data gender
    const url = API_BASE_URL + '/C_optiondata/get_residential';

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          // 'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const jsonResult = await response.json();

      if (response.ok && jsonResult.success) {
        setresidentialIdOptions(jsonResult.data);
      } else {
        console.error("Gagal memuat Resident ID options:", jsonResult.message);
      }
    } catch (e) {
      console.error("Network Error saat memuat Resident ID options:", e);
    } finally {
      setLoadingresidentialId(false);
    }
  };
  React.useEffect(() => {
    // fetchResidentialIdOptions();
    // fetchStatus();
    fetchDeviceIP();
    setresidentialId(localStorage.getItem('residential_id'));
    setidResident(localStorage.getItem('id_resident'));


    // Atur interval polling (misalnya setiap 2000 ms = 2 detik)
    // const intervalId = setInterval(fetchStatus, 2000);

    // // Fungsi cleanup: membersihkan interval saat komponen dilepas
    // return () => clearInterval(intervalId);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [dataValid, IP_ESP, residentialId, idResident]);

  return (
    <AdminLayout>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>QR Code Scanner Input</Typography>

          <Box sx={{ mt: 3 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TextField
              label="Pindai QR Code di sini"
              value={qrCode}
              onChange={handleQrCodeChange}
              inputRef={inputRef} // Hubungkan ref untuk auto-focus
              // sx={{ width: lebartextbox, }}
              fullWidth
              size="large"
              disabled={loadingQR} // Nonaktifkan saat sedang memuat
              autoComplete="off" // Penting agar browser tidak memunculkan saran
              helperText="Arahkan scanner ke QR Code. Tekan enter/tab jika scanner Anda tidak otomatis mengirim."
            />

            {loadingQR && (
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                <Typography>Memeriksa data...</Typography>
              </Box>
            )}

            {/* Tombol manual (opsional, jika scanner bermasalah) */}
            <Button
              variant="contained"
              onClick={() => checkQrCodeData(qrCode)}
              disabled={loadingQR || !qrCode}
              sx={{ mt: 2 }}
            >
              Cek Manual
            </Button>
            
          </Box>
          <Button
              variant="contained"
              onClick={() => handleMove('kiri')}
              // disabled={loadingQR || !qrCode}
              sx={{ mt: 2 }}
            >
              Buka Gerbang Manual
            </Button>

          {/* DIALOG "DATA VALID" */}
          <Dialog open={dataValid} onClose={handleCloseDialog}>
            <DialogTitle sx={{ bgcolor: 'success.main', color: 'white' }}>Pengecekan Sukses!</DialogTitle>
            <DialogContent sx={{ pt: 2, mt: 2 }}>
              <Typography variant="h6">Data Valid ✅</Typography>
              <Typography>QR Code berhasil divalidasi dengan database.</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="success" variant="contained">
                OK
              </Button>
            </DialogActions>
          </Dialog>



        </Box>
      </Paper>
    </AdminLayout>

  );
}