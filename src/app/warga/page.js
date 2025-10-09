// app/users/page.js
'use client';
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
import { format } from 'date-fns';



export default function WargaPage() {
  /**
 * Mendapatkan tanggal dan waktu saat ini dalam format yyyy-MM-dd HH:mmss
 * @returns {string} Tanggal dan jam yang sudah diformat
 */
  function getCurrentDateTimeFormatted() {
    const now = new Date();
    return format(now, 'yyyy-MM-dd HH:mm:ss');
  }
  // function getIdResident() {
  //     const idResidentString = localStorage.getItem('id_resident');
  //     return idResidentString;
  // }
  const lebartextbox = '250px';
  const [residentData, setResidentData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const [residentialIdOptions, setresidentialIdOptions] = React.useState([]);
  const [loadingresidentialId, setLoadingresidentialId] = React.useState(true);
  const [genderOptions, setGenderOptions] = React.useState([]);
  const [loadingGender, setLoadingGender] = React.useState(true);
  const [maritalStatusOptions, setmartialStatusOptions] = React.useState([]);
  const [loadingmartialStatus, setLoadingmartialStatus] = React.useState(true);
  const [religionOptions, setreligionOptions] = React.useState([]);
  const [loadingreligion, setLoadingreligion] = React.useState(true);
  const [lastEducationOptions, setlastEducationOptions] = React.useState([]);
  const [loadinglastEducation, setLoadinglastEducation] = React.useState(true);
  const [occupationOptions, setoccupationOptions] = React.useState([]);
  const [loadingoccupation, setLoadingoccupation] = React.useState(true);
  const [positionOptions, setpositionOptions] = React.useState([]);
  const [loadingposition, setLoadingposition] = React.useState(true);
  const [residentStatusOptions, setresidentStatusOptions] = React.useState([]);
  const [loadingresidentStatus, setLoadingresidentStatus] = React.useState(true);

  const [idResidentString, setidResidentString] = React.useState(null); 
  // const idResidentString = localStorage.getItem('id_resident');

  const [isCheckingEmail, setIsCheckingEmail] = React.useState(false);
  const [emailCheckStatus, setEmailCheckStatus] = React.useState(null); // null, 'available', 'unavailable'
  const [emailCheckMessage, setEmailCheckMessage] = React.useState('');


  //TAMBAH DATA
  // const maritalStatusOptions = [
  //   { code: 'K', label: 'Kawin' },
  //   { code: 'B', label: 'Belum Kawin' },
  //   { code: 'C', label: 'Cerai' },
  // ];

  // const religionOptions = [
  //   { code: 'I', label: 'Islam' },
  //   { code: 'K', label: 'Kristen' },
  //   { code: 'H', label: 'Hindu' },
  //   { code: 'B', label: 'Buddha' },
  // ];
  // var idResidentString = "";
  const [openForm, setOpenForm] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const initialFormData = {
    fullname: '',
    birth_date: '',
    nik_number: '',
    kk_number: '',
    phone_number: '',
    email: '',
    status_email: '0',
    total_family: '',
    residential_id: '',
    house_number: '',
    rt: '',
    rw: '',
    gender_code: '',
    marital_status_code: '',
    religion_code: '',
    last_education_code: '',
    occupation_code: '',
    position_code: '2', //WARGA
    resident_status_code: '',
    guest_status_code: '1',
    created_date: getCurrentDateTimeFormatted(),
    created_by: idResidentString,
  };

  const isEmailCheckedAndAvailable = emailCheckStatus === 'available';
  const disableSubmitButton = 
    isSaving || 
    !isEmailCheckedAndAvailable; 
  const handleCekData = () => {
    console.log('id_resident = ', idResidentString);
    console.log('getCurrentDateTimeFormatted = ', getCurrentDateTimeFormatted());
    console.log("email status", emailCheckStatus);

  };
  const handleCheckEmail = async () => {
        if (!formData.email) {
            setEmailCheckStatus('error');
            setEmailCheckMessage('Harap isi alamat Email terlebih dahulu.');
            return;
        }

        setIsCheckingEmail(true);
        setEmailCheckStatus(null);
        setEmailCheckMessage('');
        
        const url = '/api/v1/C_resident/check_email'; 
        // const url = '/api/v1/C_resident/cek_email_resident'; 

        const token = localStorage.getItem('auth_token');
        try {
            const response = await fetch(url, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ email: formData.email }),
            });
            console.log("BodyJSON", JSON.stringify({ email: formData.email }));


            const jsonResult = await response.json();

            if (response.ok && jsonResult.success) {
                // Email belum terdaftar (Backend harus mengembalikan success: true jika available)
                setEmailCheckStatus('available');
                setEmailCheckMessage('✅ Email tersedia dan dapat digunakan.');
                // handleAddResident();
            } else {
                // Email sudah terdaftar (Backend harus mengembalikan success: false jika unavailable)
                setEmailCheckStatus('unavailable');
                setEmailCheckMessage(jsonResult.message || '❌ Email sudah terdaftar. Gunakan Email lain.');
            }
        } catch (e) {
            setEmailCheckStatus('error');
            setEmailCheckMessage('Koneksi gagal saat cek email. Coba lagi.');
            console.log(e);
            // setEmailCheckMessage(e);

        } finally {
            setIsCheckingEmail(false);
        }
    };
  const [formData, setFormData] = React.useState(initialFormData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    console.log("handleInputChange", e.target);
    

  };
  const handleOpenForm = () => {
    setOpenForm(true)
    setEmailCheckStatus('');
     setEmailCheckMessage('');
  };
  const handleCloseForm = () => {
    setOpenForm(false);
    setFormData(initialFormData);
    setError(null);
  };
  const handleAddResident = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    // Asumsi: Endpoint API CodeIgniter Anda untuk menambah data resident
    const url = '/api/v1/C_resident/insert_resident';
    const token = localStorage.getItem('auth_token');
     const createdByValue  = localStorage.getItem('id_resident');

    // handleCheckEmail();
    const dataToSend = {
        ...formData, // Semua data dari form
        created_by: createdByValue,
    };

    if(emailCheckStatus=='available'){
      try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const jsonResult = await response.json();

      if (response.ok && jsonResult.success) {
        handleCloseForm();
        window.location.reload();
      } else {
        setError(jsonResult.message || 'Gagal menambahkan data resident.');
      }
    } catch (e) {
      setError('Koneksi gagal atau terjadi kesalahan jaringan saat menambah data.');
    } finally {
      setIsSaving(false);
    }
    }
    
  };
  // TAMBAH DATA FUNGSI SAMPAI SINI




  React.useEffect(() => {
    const fetchData = async () => {
      const url = '/api/v1/C_resident/get_resident';
      const token = localStorage.getItem('auth_token');
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
          setResidentData(jsonResult.data);
        } else {
          setError(jsonResult.message || 'Gagal mengambil data resident.');
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
      const url = '/api/v1/C_optiondata/get_residential';

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
    const fetchGenderOptions = async () => {
      const token = localStorage.getItem('auth_token');
      // Ganti URL ini dengan endpoint API Anda untuk data gender
      const url = '/api/v1/C_optiondata/get_gender';

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
          setGenderOptions(jsonResult.data);
        } else {
          console.error("Gagal memuat gender options:", jsonResult.message);
        }
      } catch (e) {
        console.error("Network Error saat memuat gender options:", e);
      } finally {
        setLoadingGender(false);
      }
    };
    const fetchMaritalStatusOptions = async () => {
      const token = localStorage.getItem('auth_token');
      // Ganti URL ini dengan endpoint API Anda untuk data gender
      const url = '/api/v1/C_optiondata/get_marital_status';

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
          setmartialStatusOptions(jsonResult.data);
        } else {
          console.error("Gagal memuat MaritalStatus options:", jsonResult.message);
        }
      } catch (e) {
        console.error("Network Error saat memuat MaritalStatus options:", e);
      } finally {
        setLoadingmartialStatus(false);
      }
    };
    const fetchReligionOptions = async () => {
      const token = localStorage.getItem('auth_token');
      // Ganti URL ini dengan endpoint API Anda untuk data gender
      const url = '/api/v1/C_optiondata/get_religion';

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
          setreligionOptions(jsonResult.data);
        } else {
          console.error("Gagal memuat Religion options:", jsonResult.message);
        }
      } catch (e) {
        console.error("Network Error saat memuat Religion options:", e);
      } finally {
        setLoadingreligion(false);
      }
    };
    const fetchLastEducationOptions = async () => {
      const token = localStorage.getItem('auth_token');
      // Ganti URL ini dengan endpoint API Anda untuk data gender
      const url = '/api/v1/C_optiondata/get_last_education';

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
          setlastEducationOptions(jsonResult.data);
        } else {
          console.error("Gagal memuat LastEducation options:", jsonResult.message);
        }
      } catch (e) {
        console.error("Network Error saat memuat LastEducation options:", e);
      } finally {
        setLoadinglastEducation(false);
      }
    };
    const fetchOccupationOptions = async () => {
      const token = localStorage.getItem('auth_token');
      // Ganti URL ini dengan endpoint API Anda untuk data gender
      const url = '/api/v1/C_optiondata/get_occupation';

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
          setoccupationOptions(jsonResult.data);
        } else {
          console.error("Gagal memuat Occupation options:", jsonResult.message);
        }
      } catch (e) {
        console.error("Network Error saat memuat Occupation options:", e);
      } finally {
        setLoadingoccupation(false);
      }
    };
    const fetchResidentStatusOptions = async () => {
      const token = localStorage.getItem('auth_token');
      // Ganti URL ini dengan endpoint API Anda untuk data gender
      const url = '/api/v1/C_optiondata/get_resident_status';

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
          setresidentStatusOptions(jsonResult.data);
        } else {
          console.error("Gagal memuat ResidentStatus options:", jsonResult.message);
        }
      } catch (e) {
        console.error("Network Error saat memuat ResidentStatus options:", e);
      } finally {
        setLoadingresidentStatus(false);
      }
    };



    fetchData();
    fetchResidentialIdOptions();
    fetchGenderOptions();
    fetchMaritalStatusOptions();
    fetchReligionOptions();
    fetchLastEducationOptions();
    fetchOccupationOptions();
    fetchResidentStatusOptions();
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
        Manajemen Data Resident
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Button size="small" variant="outlined" color="success" onClick={handleOpenForm}>Tambah Data</Button>

        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>No</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Nama</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Telp</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Nama Perumahan</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status Rumah</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status Terima Tamu</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Aksi</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {residentData.map((user, index) => (
                <TableRow
                  key={user.id_resident}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">{index + 1}</TableCell>
                  <TableCell>{user.fullname}</TableCell>
                  <TableCell>{user.phone_number}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.residential_name}</TableCell>
                  <TableCell>{user.resident_status_name}</TableCell>
                  <TableCell>{user.guest_status_name}</TableCell>

                  <TableCell>
                    <Button size="small" variant="outlined" sx={{ mr: 1 }}>Edit</Button>
                    <Button size="small" variant="outlined" color="error">Hapus</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ----------------------------------- */}
        {/* ✅ DIALOG FORM INPUT DATA RESIDENT */}
        {/* ----------------------------------- */}
        <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="md">
          <DialogTitle sx={{ bgcolor: '#394e77', color: 'white', padding: 2 }}>
            Input Data Resident Baru
          </DialogTitle>
          <Box component="form" onSubmit={handleAddResident}>
            <DialogContent dividers> {/* dividers: memberikan garis pemisah */}
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              {/* <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>Informasi Dasar</Typography> */}
              <Grid container spacing={3}> {/* Tambah spacing untuk jarak antar field */}

                {/* Baris 1: Nama, Tanggal Lahir, NIK */}
                <Grid item xs={12} sm={4}>
                  <TextField margin="none" sx={{ width: lebartextbox, }} size="small" label="Nama Lengkap" name="fullname" value={formData.fullname} onChange={handleInputChange} required />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    margin="none"
                    sx={{ width: lebartextbox, }}
                    size="small"
                    label="Tanggal Lahir"
                    name="birth_date"
                    type="date"
                    value={formData.birth_date}
                    onChange={handleInputChange}
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField margin="none" sx={{ width: lebartextbox, }} size="small" label="NIK" name="nik_number" value={formData.nik_number} onChange={handleInputChange} required />
                </Grid>

                {/* Baris 2: KK, Telp, Email */}
                <Grid item xs={12} sm={4}>
                  <TextField margin="none" sx={{ width: lebartextbox, }} size="small" label="Nomor KK" name="kk_number" value={formData.kk_number} onChange={handleInputChange} required />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    margin="none"
                    sx={{ width: lebartextbox, }}
                    size="small"
                    label="Jenis Kelamin"
                    name="gender_code"
                    value={formData.gender_code}
                    onChange={handleInputChange}
                    required
                    disabled={loadingGender}
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
                    {loadingGender && <MenuItem disabled>Memuat Jenis Kelamin...</MenuItem>}
                    {genderOptions.map((option) => (
                      <MenuItem
                        key={option.gender_code}
                        value={option.gender_code}
                      >
                        {option.gender_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField margin="none" sx={{ width: lebartextbox, }} size="small" label="Nomor Telepon" name="phone_number" value={formData.phone_number} onChange={handleInputChange} required />
                </Grid>
                {/* <Grid item xs={12} sm={4}>
                  <TextField margin="none" sx={{width: lebartextbox,}} size="small" label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} required/>
                </Grid> */}
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    <TextField
                      margin="none"
                      sx={{width: lebartextbox,}}
                      size="small"
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      // Tampilkan warna/status berdasarkan hasil pengecekan
                      error={emailCheckStatus === 'unavailable' || emailCheckStatus === 'error'}
                      color={emailCheckStatus === 'available' ? 'success' : 'primary'}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleCheckEmail}
                      disabled={isCheckingEmail || !formData.email}
                      size="small"
                      sx={{ height: '40px', minWidth: '80px' }} // Atur tinggi agar sejajar dengan TextField
                    >
                      {isCheckingEmail ? 'Cek...' : 'Cek'}
                    </Button>
                  </Box>

                  {/* Pesan Status Pengecekan */}
                  {emailCheckMessage && (
                    <Typography
                      variant="caption"
                      sx={{
                        ml: 0.5,
                        color: emailCheckStatus === 'available' ? 'green' : 'red'
                      }}
                    >
                      {emailCheckMessage}
                    </Typography>
                  )}
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />
              {/* <Typography variant="h6" gutterBottom>Alamat & Keluarga</Typography> */}
              <Grid container spacing={3}>

                {/* Baris 3: ID Perumahan, No. Rumah, Total Keluarga */}
                <Grid item xs={12} sm={4}>
                  {/* <TextField margin="none" sx={{width: lebartextbox,}} size="small" label="ID Perumahan" name="residential_id" value={formData.residential_id} onChange={handleInputChange} required /> */}
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
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField margin="none" sx={{ width: lebartextbox, }} size="small" label="Nomor Rumah" name="house_number" value={formData.house_number} onChange={handleInputChange} required />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField margin="none" sx={{ width: lebartextbox, }} size="small" label="Total Keluarga" name="total_family" value={formData.total_family} onChange={handleInputChange} type="number" required />
                </Grid>

                {/* Baris 4: RT, RW */}
                <Grid item xs={12} sm={4}>
                  <TextField margin="none" sx={{ width: lebartextbox, }} size="small" label="RT" name="rt" value={formData.rt} onChange={handleInputChange} required />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField margin="none" sx={{ width: lebartextbox, }} size="small" label="RW" name="rw" value={formData.rw} onChange={handleInputChange} required />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />
              {/* <Typography variant="h6" gutterBottom>Status & Kode</Typography> */}
              <Grid container spacing={3}>

                {/* Baris 5: Jenis Kelamin, Status Kawin, Agama (Menggunakan Select) */}

                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    margin="none"
                    sx={{ width: lebartextbox, }}
                    size="small"
                    label="Status Perkawinan"
                    name="marital_status_code"
                    value={formData.marital_status_code}
                    onChange={handleInputChange}
                    required
                    disabled={loadingmartialStatus}
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
                    {loadingmartialStatus && <MenuItem disabled>Memuat Status Perkawinan...</MenuItem>}
                    {maritalStatusOptions.map((option) => (
                      <MenuItem
                        key={option.marital_status_code}
                        value={option.marital_status_code}
                      >
                        {option.marital_status_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    margin="none"
                    sx={{ width: lebartextbox, }}
                    size="small"
                    label="Agama"
                    name="religion_code"
                    value={formData.religion_code}
                    onChange={handleInputChange}
                    required
                    disabled={loadingreligion}
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
                    {loadingreligion && <MenuItem disabled>Memuat Data...</MenuItem>}
                    {religionOptions.map((option) => (
                      <MenuItem
                        key={option.religion_code}
                        value={option.religion_code}
                      >
                        {option.religion_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Baris 6: Pendidikan, Pekerjaan, Posisi */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    margin="none"
                    sx={{ width: lebartextbox, }}
                    size="small"
                    label="Pendidikan Terakhir"
                    name="last_education_code"
                    value={formData.last_education_code}
                    onChange={handleInputChange}
                    required
                    disabled={loadinglastEducation}
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
                    {loadinglastEducation && <MenuItem disabled>Memuat Data Pendidikan...</MenuItem>}
                    {lastEducationOptions.map((option) => (
                      <MenuItem
                        key={option.last_education_code}
                        value={option.last_education_code}
                      >
                        {option.last_education_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    margin="none"
                    sx={{ width: lebartextbox, }}
                    size="small"
                    label="Pekerjaan"
                    name="occupation_code"
                    value={formData.occupation_code}
                    onChange={handleInputChange}
                    required
                    disabled={loadingoccupation}
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
                    {loadingoccupation && <MenuItem disabled>Memuat Data Pekerjaan...</MenuItem>}
                    {occupationOptions.map((option) => (
                      <MenuItem
                        key={option.occupation_code}
                        value={option.occupation_code}
                      >
                        {option.occupation_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                {/* <Grid item xs={12} sm={4}>
                  <TextField margin="none" sx={{width: lebartextbox,}} size="small" label="Kode Posisi" name="position_code" value={formData.position_code} onChange={handleInputChange} />
                </Grid> */}

                {/* Baris 7: Status Resident, Status Tamu, Status Email */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    margin="none"
                    sx={{ width: lebartextbox, }}
                    size="small"
                    label="Status Rumah"
                    name="resident_status_code"
                    value={formData.resident_status_code}
                    onChange={handleInputChange}
                    required
                    disabled={loadingresidentStatus}
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
                    {loadingresidentStatus && <MenuItem disabled>Memuat Data Status Rumah...</MenuItem>}
                    {residentStatusOptions.map((option) => (
                      <MenuItem
                        key={option.resident_status_code}
                        value={option.resident_status_code}
                      >
                        {option.resident_status_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                {/* <Grid item xs={12} sm={4}>
                  <TextField margin="none" sx={{width: lebartextbox,}} size="small" label="Kode Status Terima Tamu" name="guest_status_code" value={formData.guest_status_code} onChange={handleInputChange} required />
                </Grid> */}
                {/* <Grid item xs={12} sm={4}>
                  <TextField margin="none" sx={{width: lebartextbox,}} size="small" label="Status Email (0/1)" name="status_email" value={formData.status_email} onChange={handleInputChange} type="number" />
                </Grid> */}

              </Grid>
            </DialogContent>
            <DialogActions sx={{ padding: 2 }}>
              <Button onClick={handleCekData} color="warning" variant="outlined" disabled={isSaving}>Cek Data</Button>
              <Button onClick={handleCloseForm} color="error" variant="outlined" disabled={isSaving}>Batal</Button>
              <Button type="submit" variant="contained" color="success" disabled={disableSubmitButton}>
                {isSaving ? 'Menyimpan...' : 'Simpan Data'}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Paper>



    </AdminLayout>
  );
}