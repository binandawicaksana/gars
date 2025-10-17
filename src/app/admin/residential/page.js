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
import { API_BASE_URL } from '../../utils/constants';



export default function ResidentialPage() {
  if (typeof window !== 'undefined') {
    const storedCode = localStorage.getItem('position_code');
    if (storedCode !== '99') {
      redirect('/');
      // return null;
    }
  }
  /**
 * Mendapatkan tanggal dan waktu saat ini dalam format yyyy-MM-dd HH:mmss
 * @returns {string} Tanggal dan jam yang sudah diformat
 */
  function getCurrentDateTimeFormatted() {
    const now = new Date();
    return format(now, 'yyyy-MM-dd HH:mm:ss');
  }
  const lebartextbox = '250px';
  const [residentData, setResidentData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const [emailCheckStatus, setEmailCheckStatus] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [residentToDelete, setResidentToDelete] = React.useState({ id: null, fullname: '' });

  const [loadingProvince, setLoadingProvince] = React.useState(true);
  const [loadingCity, setLoadingCity] = React.useState(true);
  const [loadingDistrict, setLoadingDistrict] = React.useState(true);
  const [loadingVillage, setLoadingVillage] = React.useState(true);
  const [provinceOptions, setProvinceOptions] = React.useState([]);
  const [cityOptions, setCityOptions] = React.useState([]);
  const [districtOptions, setDistrictOptions] = React.useState([]);
  const [villageOptions, setVillageOptions] = React.useState([]);

  const [openForm, setOpenForm] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [formData, setFormData] = React.useState(initialFormData);

  const initialFormData = {
    residential_id: '',
    residential_name: '',
    address: '',
    village_code: '',
    // village_name: '',
    district_code: '',
    // district_name: '',
    city_code: '',
    // city_name: '',
    province_code: '',
    // province_name: '',
  };
  const disableSubmitButton =
    isSaving

  const handleOpenDeleteDialog = (residentialID) => {
    // ✅ 1. Cari objek resident berdasarkan ID
    const resident = residentData.find(r => r.residential_id === residentialID);

    if (resident) {
      // ✅ 2. Simpan ID dan Nama Lengkap ke state
      setResidentToDelete({
        id: resident.residential_id,
        fullname: resident.residential_name
      });
      setOpenDeleteDialog(true);
    }
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    // ✅ Reset state
    setResidentToDelete({ id: null, fullname: '' });
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // ----------------------------------------------------
  // ✅ LOGIKA FILTER DATA
  // ----------------------------------------------------
  const filteredResidents = React.useMemo(() => {
    if (!searchTerm) {
      return residentData; // Jika kosong, kembalikan semua data
    }

    const lowerCaseSearch = searchTerm.toLowerCase();

    return residentData.filter(resident => {
      // Gabungkan kolom yang ingin dicari (misalnya nama dan nomor telepon)
      // Gunakan operator || (OR) untuk mencocokkan di salah satu kolom
      return (
        resident.residential_name.toLowerCase().includes(lowerCaseSearch) ||
        resident.address.toLowerCase().includes(lowerCaseSearch) ||
        resident.village_name.toLowerCase().includes(lowerCaseSearch) ||
        resident.district_name.toLowerCase().includes(lowerCaseSearch) ||
        resident.city_name.toLowerCase().includes(lowerCaseSearch) || // Cari berdasarkan Nama Perumahan
        resident.province_name.toLowerCase().includes(lowerCaseSearch)  // Cari berdasarkan Nama Perumahan
        // Cari berdasarkan Nama Perumahan

      );
    });
  }, [residentData, searchTerm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    console.log("handleInputChange", e.target);
    console.log("handleInputChange", e.target.name);
    if (e.target.name === 'province_code') {
      fetchCity(e.target.value);
    }
    if (e.target.name === 'city_code') {
      fetchDistrict(e.target.value);
    }
    if (e.target.name === 'district_code') {
      fetchVillage(e.target.value);
    }
    if (e.target.name === 'vilage_code') {
      // setIsSaving(true);
    }
  };

  const handleOpenEditForm = (residentialID) => {
    const residentToEdit = residentData.find(r => r.residential_id === residentialID);

    if (residentToEdit) {
      setFormData({
        ...residentToEdit,
      });
      console.log('setFormData residentToEdit', residentToEdit);
      fetchCity(residentToEdit.province_code);
      fetchDistrict(residentToEdit.city_code);
      fetchVillage(residentToEdit.district_code);
      setIsEditMode(true);
      setOpenForm(true);
    } else {
      setError('Data perumahan yang ingin di edit tidak ditemukan.');
    }
  };
  const handleOpenForm = () => {
    setOpenForm(true)
    setIsEditMode(false); // Pastikan mode Add
    setFormData(initialFormData); 
  };
  const handleCloseForm = () => {
    setOpenForm(false);
    setFormData(initialFormData);
    setIsEditMode(false); // Reset mode Edit
    setError(null);
  };
  const handleAddResident = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    const url = API_BASE_URL + '/C_resident/insert_resident';
    const token = localStorage.getItem('auth_token');
    const createdByValue = localStorage.getItem('id_resident');
    const userDataString = JSON.parse(localStorage.getItem('user_data'));
    const residentialIdString = userDataString.residential_id;
    const rtString = userDataString.rt;
    const rwString = userDataString.rw;
    const dataToSend = {
      ...formData, 
      residential_id: residentialIdString,
      rt: rtString,
      rw: rwString,
      created_by: createdByValue,
    };

    if (emailCheckStatus == 'available') {
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
  const handleSubmitForm = async (e) => { // ✅ Ganti nama fungsi
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    const token = localStorage.getItem('auth_token');
    const operatorId = localStorage.getItem('id_resident');
    const userDataString = JSON.parse(localStorage.getItem('user_data'));

    let url;
    let dataToSend;
    if (isEditMode) {
      url = API_BASE_URL + '/C_residential/update_residential';
      dataToSend = {
        ...formData,
      };
      console.log('dataToSend', dataToSend);

    } else {
      // Mode Tambah (Insert)
      url = API_BASE_URL + '/C_residential/insert_residential';
      dataToSend = {
        ...formData,
      };
    }
    try {
      const response = await fetch(url, {
        method: 'POST', // Gunakan POST untuk insert/update CodeIgniter
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const jsonResult = await response.json();

      if (response.ok && jsonResult.success) {
        handleCloseForm();
        window.location.reload(); // Refresh data
      } else {
        setError(jsonResult.message || `Gagal ${isEditMode ? 'memperbarui' : 'menambahkan'} data resident.`);
      }
    } catch (e) {
      setError('Koneksi gagal atau terjadi kesalahan jaringan saat menyimpan data.');
      console.log("Error SIMPAN/EDIT", e)
    } finally {
      setIsSaving(false);
    }
  };
  const handleDeleteResident = async () => {
    if (!residentToDelete) return;

    setIsSaving(true); 
    setError(null);
    const url = `${API_BASE_URL}/C_resident/delete_resident`;
    const token = localStorage.getItem('auth_token');

    const dataToSend = {
      id_resident: residentToDelete.id,
    };
    const bodyData = new URLSearchParams({
      residential_id: residentToDelete.id,
    }).toString();
    console.log("bodyData", bodyData)
    console.log("token", token)



    try {
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
        handleCloseDeleteDialog();
        window.location.reload(); 
      } else {
        setError(jsonResult.message || 'Gagal menghapus data perumahan.');
      }
    } catch (e) {
      setError('Koneksi gagal atau terjadi kesalahan jaringan saat menghapus data. ' + e);
      console.log("Error Delete", e)
    } finally {
      setIsSaving(false);
    }
  };
  // TAMBAH DATA FUNGSI SAMPAI SINI
/**
 * @param {string} provinceCode 
 */
  const fetchCity = async (provinceCode) => {
    const token = localStorage.getItem('auth_token');
    const url = API_BASE_URL + '/C_residential/get_city';
    try {
      const bodyData = new URLSearchParams({
        province_code: provinceCode
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
        setCityOptions(jsonResult.data);
      } else {
        setError(jsonResult.message || 'Gagal mengambil data resident.');
      }
    } catch (e) {
      setError('Koneksi gagal atau terjadi kesalahan jaringan.');
      console.log(e);
    } finally {
      setLoadingCity(false);
    }
  };
  /**
 * @param {string} cityCode 
 */
  const fetchDistrict = async (cityCode) => {
    const token = localStorage.getItem('auth_token');
    const url = API_BASE_URL + '/C_residential/get_district';
    try {
      const bodyData = new URLSearchParams({
        city_code: cityCode
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
        //  body: JSON.stringify({ residential_id: residential_id,  rt: rtdata,  rw: rwdata}),
      });
      const jsonResult = await response.json();
      if (response.ok && jsonResult.success) {
        setDistrictOptions(jsonResult.data);
      } else {
        setError(jsonResult.message || 'Gagal mengambil data resident.');
      }
    } catch (e) {
      setError('Koneksi gagal atau terjadi kesalahan jaringan.');
      console.log(e);
    } finally {
      setLoadingDistrict(false);
    }
  };
  /**
 * @param {string} districtCode 
 */
  const fetchVillage = async (districtCode) => {
    const token = localStorage.getItem('auth_token');
    const url = API_BASE_URL + '/C_residential/get_village';
    try {
      const bodyData = new URLSearchParams({
        district_code: districtCode
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
        setVillageOptions(jsonResult.data);
      } else {
        setError(jsonResult.message || 'Gagal mengambil data resident.');
      }
    } catch (e) {
      setError('Koneksi gagal atau terjadi kesalahan jaringan.');
      console.log(e);
    } finally {
      setLoadingVillage(false);
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const url = API_BASE_URL + '/C_residential/get_residential';
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
          setError(jsonResult.message || 'Gagal mengambil data residential.');
        }
      } catch (e) {
        setError('Koneksi gagal atau terjadi kesalahan jaringan.');
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    const fetchProvince = async () => {
      const token = localStorage.getItem('auth_token');
      const url = API_BASE_URL + '/C_residential/get_province';

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
          setProvinceOptions(jsonResult.data);
        } else {
          console.error("Gagal memuat Resident ID options:", jsonResult.message);
        }
      } catch (e) {
        console.error("Network Error saat memuat Resident ID options:", e);
      } finally {
        setLoadingProvince(false);
      }
    };
    fetchData();
    fetchProvince();
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
        Manajemen Data Perumahan
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>

        <Box display="flex" alignItems="center" mb={2}>

          {/* Input Pencarian (Tinggal di sebelah kiri) */}
          <TextField
            label="Cari Data"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ width: 300 }}
          />

          {/* Tombol Tambah Data (Didorong ke kanan dengan ml: 'auto') */}
          <Button
            size="small"
            variant="outlined"
            color="success"
            onClick={handleOpenForm}
            sx={{ ml: 'auto' }} // <-- PENTING: Mendorong tombol ke margin kanan
          >
            Tambah Data
          </Button>

        </Box>
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>No</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Nama Perumahan</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Alamat</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Kelurahan/Desa</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Kecamatan</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Kota/Kabupaten</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Provinsi</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {residentData.map((user, index) => ( */}
              {filteredResidents.map((user, index) => (
                <TableRow
                  key={user.residential_id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">{index + 1}</TableCell>
                  <TableCell>{user.residential_name}</TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>{user.village_name}</TableCell>
                  <TableCell>{user.district_name}</TableCell>
                  <TableCell>{user.city_name}</TableCell>
                  <TableCell>{user.province_name}</TableCell>

                  <TableCell>
                    {/* <Button size="small" variant="outlined" sx={{ mr: 1 }}>Edit</Button> */}
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ mr: 1 }}
                      onClick={() => handleOpenEditForm(user.residential_id)}
                    >
                      Edit
                    </Button>
                    {/* <Button size="small" variant="outlined" color="error">Hapus</Button> */}
                    {/*<Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleOpenDeleteDialog(user.residential_id)}
                    >
                      Hapus
                    </Button>*/}
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
            {/* ✅ Ganti Title */}
            {isEditMode ? 'Edit Data Security' : 'Input Data Security'}
          </DialogTitle>
          <Box component="form" onSubmit={handleSubmitForm}>


            <DialogContent dividers> 
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              <Grid container spacing={3}> 
                <Grid item xs={12} sm={4}>
                  <TextField margin="none" sx={{ width: lebartextbox, }} size="small" label="Nama Perumahan" name="residential_name" value={formData.residential_name} onChange={handleInputChange} required />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField margin="none" sx={{ width: lebartextbox, }} size="small" label="Alamat" name="address" value={formData.address} onChange={handleInputChange} required />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    margin="none"
                    sx={{ width: lebartextbox, }}
                    size="small"
                    label="Provinsi"
                    name="province_code"
                    value={formData.province_code}
                    onChange={handleInputChange}
                    required
                    disabled={loadingProvince}
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
                    {loadingProvince && <MenuItem disabled>Memuat Data Provinsi...</MenuItem>}
                    {provinceOptions.map((option) => (
                      <MenuItem
                        key={option.province_code}
                        value={option.province_code}
                      >
                        {option.province_name}
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
                    label="Kota/Kabupaten"
                    name="city_code"
                    value={formData.city_code}
                    onChange={handleInputChange}
                    required
                    disabled={loadingCity}
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
                    {loadingCity && <MenuItem disabled>Memuat Data Kota...</MenuItem>}
                    {cityOptions.map((option) => (
                      <MenuItem
                        key={option.city_code}
                        value={option.city_code}
                      >
                        {option.city_name}
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
                    label="Kecamatan"
                    name="district_code"
                    value={formData.district_code}
                    onChange={handleInputChange}
                    required
                    disabled={loadingDistrict}
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
                    {loadingDistrict && <MenuItem disabled>Memuat Data Kecamatan...</MenuItem>}
                    {districtOptions.map((option) => (
                      <MenuItem
                        key={option.district_code}
                        value={option.district_code}
                      >
                        {option.district_name}
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
                    label="Kelurahan/Desa"
                    name="village_code"
                    value={formData.village_code}
                    onChange={handleInputChange}
                    required
                    disabled={loadingVillage}
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
                    {loadingVillage && <MenuItem disabled>Memuat Data Kelurahan...</MenuItem>}
                    {villageOptions.map((option) => (
                      <MenuItem
                        key={option.village_code}
                        value={option.village_code}
                      >
                        {option.village_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </DialogContent>


            <DialogActions sx={{ padding: 2 }}>
              <Button onClick={handleCloseForm} color="error" variant="outlined" disabled={isSaving}>Batal</Button>
              <Button type="submit" variant="contained" color="success" disabled={disableSubmitButton}>
                {/* ✅ Ganti Label Tombol */}
                {isSaving ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Simpan Data')}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Paper>

      {/* ----------------------------------- */}
      {/* ✅ DIALOG KONFIRMASI HAPUS DATA */}
      {/* ----------------------------------- */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle sx={{ bgcolor: 'error.main', color: 'white' }}>
          Konfirmasi Penghapusan
        </DialogTitle>
        <DialogContent sx={{ pt: 2, mt: 2 }}>
          <Typography>
            Anda yakin ingin menghapus data Resident atas nama: <strong>{residentToDelete.fullname}</strong>?
          </Typography>
          <Typography color="error" sx={{ mt: 1 }}>
            Aksi ini tidak dapat dibatalkan.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDeleteDialog}
            color="primary"
            disabled={isSaving}
          >
            Batal
          </Button>
          <Button
            onClick={handleDeleteResident}
            color="error"
            variant="contained"
            disabled={isSaving}
          >
            {isSaving ? 'Menghapus...' : 'Hapus Data'}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout >
  );
}