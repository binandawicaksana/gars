// app/page.js (Contoh Fetching Data)
'use client';
import * as React from 'react';
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
import AdminLayout from './components/AdminLayout'; // Sesuaikan jalur impor
import { API_BASE_URL } from './utils/constants';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';

export default function DashboardPage() {
  const lebartextbox = '300px';
  const [userFullname, setUserFullname] = React.useState('');
  const [loadingDashboard, setLoadingDashboard] = React.useState(true);
  const [residentialCombobox, setresidentialCombobox] = React.useState(true);
  const [residentialIdOptions, setresidentialIdOptions] = React.useState([]);
  const [loadingresidentialId, setLoadingresidentialId] = React.useState(true);
  const [residentData, setResidentData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
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
      fetchHistoryScan(e.target.value);
    }
  };
  
 /**
 * Mendapatkan tanggal dan waktu saat ini dalam format yyyy-MM-dd HH:mmss
 * @returns {string} Tanggal dan jam yang sudah diformat
 * @param {string} tanggalData 
 */
  function changeFormatDate(tanggalData) {
    // const now = new Date();
    return format(tanggalData, 'dd-MM-yyyy');
  }
  function changeFormatDateDetail(tanggalData) {
    // const now = new Date();
    return format(tanggalData, 'dd-MM-yyyy HH:mm:ss');
  }
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
  const fetchHistoryScan = async (residentialId) => {
    const token = localStorage.getItem('auth_token');
    const url = API_BASE_URL + '/C_guest/detail_guest_history_security';
    try {
      const bodyData = new URLSearchParams({
        residential_id: residentialId
      }).toString();
      console.log('URL', url);
      console.log('bodyData', bodyData);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`,
        },
        body: bodyData,
      });
      const jsonResult = await response.json();
      if (response.ok && jsonResult.success) {
        setResidentData(jsonResult.data);
      } else {
        setError(jsonResult.message || 'Gagal mengambil data.');
        setResidentData(jsonResult.data);

      }
    } catch (e) {
      setError('Koneksi gagal atau terjadi kesalahan jaringan.');
      console.log(e);
    } finally {
      setLoading(false);
    }
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
    // Karena localStorage hanya tersedia di sisi client (browser), 
    // pastikan Anda memanggilnya di dalam useEffect atau di kondisi is client side.
    const userDataString = JSON.parse(localStorage.getItem('user_data'));
    const residentialIdString = userDataString.residential_id;
    const fullname = getFullName();
    if (fullname) {
      setUserFullname(fullname);
    }
    const fetchToken = async () => {
      const token = localStorage.getItem('auth_token');
      // Ganti URL ini dengan endpoint API Anda untuk data gender
      const url = API_BASE_URL + '/dashboard';
      // console.error("response", url);
      // console.error("token", token);
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const jsonResult = await response.json();
        if (response.ok && jsonResult.success) {
          // setresidentialIdOptions(jsonResult.data);
        } else {
          // console.error("Gagal memuat Resident ID options:", jsonResult.message);
          redirect('/login');
        }
      } catch (e) {
        console.error("Network Error", e);
      } finally {
        setLoadingDashboard(false);
      }
    };
    

    fetchToken();
    fetchResidentialIdOptions();
    if (residentialIdString!=0){
      fetchHistoryScan(residentialIdString);
      setresidentialCombobox(false);
    }
  }, []);

  // 3. Tampilkan data yang sudah dimuat
  return (
    <AdminLayout>
      <Typography variant="h4" gutterBottom>
        <p>Halo, Selamat Datang: <strong>{userFullname || 'Pengguna'}</strong></p>
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
         <Typography variant="h6" gutterBottom mb={2}>
        <p>Data Tamu yang telah di scan</p>
      </Typography>
        <Box display="flex" alignItems="center" mb={2}>
          <Grid item xs={12} sm={4}>
            {residentialCombobox &&
            <TextField
              select
              margin="none"
              sx={{ width: lebartextbox, }}
              size="small"
              label="Nama Perumahan"
              name="residential_id"
              value={formData.residential_id}
              onChange={handleInputChange}
              required
              disabled={loadingresidentialId}
              
              slotProps={{
                select: { // Target komponen <Select> internal
                  MenuProps: { // Target komponen <Menu> internal
                    PaperProps: {
                      style: {
                        maxHeight: 200, // Batasi tinggi dropdown
                      },
                    },
                  },
                },
              }}
            >
              {loadingresidentialId && <MenuItem disabled>Memuat Nama Perumahan...</MenuItem>}
              {residentialIdOptions.map((option) => (
                <MenuItem
                  key={option.residential_id}
                  value={option.residential_id}
                >
                  {option.residential_name}
                </MenuItem>
              ))}
            </TextField>
            }
            
          </Grid>

        </Box>
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>No</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Nama Warga</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Nama Tamu</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Tamu Datang</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Tamu Pulang</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Kendaraan</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Nama Security</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Tanggal Scan</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {residentData.map((user, index) => (
              // {filteredResidents.map((user, index) => (
                <TableRow
                  key={user.id_guest}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">{index + 1}</TableCell>
                  <TableCell>{user.fullname}</TableCell>
                  <TableCell>{user.name_guest}</TableCell>
                  <TableCell>{changeFormatDate(user.guests_come)}</TableCell>
                  <TableCell>{changeFormatDate(user.guests_leaving)}</TableCell>
                  <TableCell>{user.vehicle_name}</TableCell>
                  <TableCell>{user.security_name}</TableCell>
                  <TableCell>{changeFormatDateDetail(user.validate_security_date)}</TableCell>

                  {/* <TableCell> */}
                  {/* <Button size="small" variant="outlined" sx={{ mr: 1 }}>Edit</Button> */}
                  {/* <Button
                      size="small"
                      variant="outlined"
                      sx={{ mr: 1 }}
                      onClick={() => handleOpenEditForm(user.residential_id)}
                    >
                      Edit
                    </Button> */}
                  {/* <Button size="small" variant="outlined" color="error">Hapus</Button> */}
                  {/*<Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleOpenDeleteDialog(user.residential_id)}
                    >
                      Hapus
                    </Button>*/}
                  {/* </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

    </AdminLayout>
  );
}