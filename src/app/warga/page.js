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
import { API_BASE_URL } from '../utils/constants';



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
  const [searchTerm, setSearchTerm] = React.useState('');

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [residentToDelete, setResidentToDelete] = React.useState({ id: null, fullname: '' });


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
  const [isEditMode, setIsEditMode] = React.useState(false);

  const initialFormData = {
    id_resident: '',
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

  const handleOpenDeleteDialog = (idResident) => {
    // ✅ 1. Cari objek resident berdasarkan ID
    const resident = residentData.find(r => r.id_resident === idResident);

    if (resident) {
      // ✅ 2. Simpan ID dan Nama Lengkap ke state
      setResidentToDelete({
        id: resident.id_resident,
        fullname: resident.fullname
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
        resident.fullname.toLowerCase().includes(lowerCaseSearch) ||
        resident.phone_number.includes(lowerCaseSearch) ||
        resident.email.toLowerCase().includes(lowerCaseSearch) ||
        resident.residential_name.toLowerCase().includes(lowerCaseSearch) ||
        resident.resident_status_name.toLowerCase().includes(lowerCaseSearch) || // Cari berdasarkan Nama Perumahan
        resident.guest_status_name.toLowerCase().includes(lowerCaseSearch)  // Cari berdasarkan Nama Perumahan
        // Cari berdasarkan Nama Perumahan

      );
    });
  }, [residentData, searchTerm]);


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

    const url = API_BASE_URL + '/C_resident/check_email';
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

  const handleOpenEditForm = (idResident) => {
    // 1. Cari data resident yang ingin di edit
    const residentToEdit = residentData.find(r => r.id_resident === idResident);

    if (residentToEdit) {
      // 2. Atur form data dengan data resident yang ada
      setFormData({
        // Copy semua properti residentToEdit
        ...residentToEdit,
        // Pastikan format tanggal sesuai untuk input type="date"
        birth_date: residentToEdit.birth_date ? residentToEdit.birth_date.split(' ')[0] : '',
        // Set created_by ke nilai awal atau ID resident yang ada (jika digunakan)
        created_by: residentToEdit.created_by, // Pertahankan created_by asli
        // updated_by: localStorage.getItem('id_resident'), // Set updater
        // updated_date: getCurrentDateTimeFormatted(), // Set waktu update


      });
      console.log('setFormData residentToEdit', residentToEdit);

      // 3. Atur state ke mode Edit
      setIsEditMode(true);
      setEmailCheckStatus('available'); // Email dianggap OK karena sudah terdaftar
      setEmailCheckMessage('✅ Email sudah terdaftar.');
      setOpenForm(true);
    } else {
      setError('Data resident yang ingin di edit tidak ditemukan.');
    }
  };
  const handleOpenForm = () => {
    setOpenForm(true)
    setIsEditMode(false); // Pastikan mode Add
    setFormData(initialFormData); // Reset form
    setEmailCheckStatus('');
    setEmailCheckMessage('');
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

    // Asumsi: Endpoint API CodeIgniter Anda untuk menambah data resident
    const url = API_BASE_URL + '/C_resident/insert_resident';
    const token = localStorage.getItem('auth_token');
    const createdByValue = localStorage.getItem('id_resident');
    const userDataString = JSON.parse(localStorage.getItem('user_data'));
    const residentialIdString = userDataString.residential_id;
    const rtString = userDataString.rt;
    const rwString = userDataString.rw;



    // handleCheckEmail();
    const dataToSend = {
      ...formData, // Semua data dari form
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

    // 1. Tentukan URL dan data berdasarkan mode (Tambah atau Edit)
    if (isEditMode) {
      // Mode Edit (Update)
      url = API_BASE_URL + '/C_resident/update_resident2';
      dataToSend = {
        ...formData,
        // updated_by: operatorId, // Pastikan ada field updated_by di API
        // updated_date: getCurrentDateTimeFormatted(),
      };
      // Hapus properti created_by jika API Anda tidak membutuhkannya di mode update
      delete dataToSend.created_by;
      delete dataToSend.created_date;
      console.log('dataToSend', dataToSend);

    } else {
      // Mode Tambah (Insert)
      url = API_BASE_URL + '/C_resident/insert_resident';
      dataToSend = {
        ...formData,
        residential_id: userDataString.residential_id,
        rt: userDataString.rt,
        rw: userDataString.rw,
        created_by: operatorId,
        created_date: getCurrentDateTimeFormatted(),
      };
    }

    // 2. Verifikasi Email (hanya wajib saat INSERT)
    if (!isEditMode && emailCheckStatus !== 'available') {
      setIsSaving(false);
      setError('Harap cek dan pastikan Email tersedia sebelum menyimpan data.');
      return;
    }

    // 3. Kirim Permintaan API
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

    setIsSaving(true); // Gunakan state isSaving yang sudah ada
    setError(null);

    // Asumsi: Endpoint API CodeIgniter Anda untuk menghapus data resident
    // Gunakan id_resident sebagai parameter di URL atau di body, 
    // di sini kita gunakan format URL umum untuk DELETE.
    const url = `${API_BASE_URL}/C_resident/delete_resident`;
    const token = localStorage.getItem('auth_token');

    const dataToSend = {
      id_resident: residentToDelete,
    };
    const bodyData = new URLSearchParams({
      id_resident: residentToDelete.id,
    }).toString();
    console.log("residentToDelete", residentToDelete.id)
    console.log("bodyData", bodyData)
    console.log("token", token)



    try {
      // const response = await fetch(url, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(dataToSend),
      // });
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`,
        },
        body: bodyData,
      });


      const jsonResult = await response.json();
      console.log("jsonResult", jsonResult);


      if (response.ok && jsonResult.success) {
        // Berhasil dihapus, tutup dialog dan muat ulang data
        handleCloseDeleteDialog();
        window.location.reload(); // Atau panggil fetchData() lagi untuk refresh data
      } else {
        // Gagal hapus
        setError(jsonResult.message || 'Gagal menghapus data resident.');
      }
    } catch (e) {
      setError('Koneksi gagal atau terjadi kesalahan jaringan saat menghapus data. ' + e);
      console.log("Error Delete", e)
    } finally {
      setIsSaving(false);
    }
  };
  // TAMBAH DATA FUNGSI SAMPAI SINI




  React.useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('auth_token');
      const positioncode = localStorage.getItem('position_code');
      const residential_id = localStorage.getItem('residential_id');
      const rtdata = localStorage.getItem('rt');
      const rwdata = localStorage.getItem('rw');
      let url;

      if (positioncode === '99') {
        url = API_BASE_URL + '/C_resident/get_resident';
      } else {
        url = API_BASE_URL + '/C_resident/get_resident_rt';
      }
      try {
        const bodyData = new URLSearchParams({
          residential_id: residential_id,
          rt: rtdata,
          rw: rwdata
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
    const fetchGenderOptions = async () => {
      const token = localStorage.getItem('auth_token');
      // Ganti URL ini dengan endpoint API Anda untuk data gender
      const url = API_BASE_URL + '/C_optiondata/get_gender';
      // const url = 'http://192.168.56.1/firegars/C_optiondata/get_gender';
      // console.log('url', url);

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
      const url = API_BASE_URL + '/C_optiondata/get_marital_status';

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
      const url = API_BASE_URL + '/C_optiondata/get_religion';

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
      const url = API_BASE_URL + '/C_optiondata/get_last_education';

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
      const url = API_BASE_URL + '/C_optiondata/get_occupation';

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
      const url = API_BASE_URL + '/C_optiondata/get_resident_status';

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
              {/* {residentData.map((user, index) => ( */}
              {filteredResidents.map((user, index) => (
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
                    {/* <Button size="small" variant="outlined" sx={{ mr: 1 }}>Edit</Button> */}
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ mr: 1 }}
                      onClick={() => handleOpenEditForm(user.id_resident)}
                    >
                      Edit
                    </Button>
                    {/* <Button size="small" variant="outlined" color="error">Hapus</Button> */}
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleOpenDeleteDialog(user.id_resident)}
                    >
                      Hapus
                    </Button>
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
          {/* <DialogTitle sx={{ bgcolor: '#394e77', color: 'white', padding: 2 }}>
            Input Data Resident Baru
          </DialogTitle>
          <Box component="form" onSubmit={handleAddResident}> */}
          {/** UPDATE DIALOG MENJADI EDIT */}

          <DialogTitle sx={{ bgcolor: '#394e77', color: 'white', padding: 2 }}>
            {/* ✅ Ganti Title */}
            {isEditMode ? 'Edit Data Resident' : 'Input Data Resident Baru'}
          </DialogTitle>
          <Box component="form" onSubmit={handleSubmitForm}>


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
                      sx={{ width: lebartextbox, }}
                      size="small"
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled={isEditMode}
                      onChange={handleInputChange}
                      // Tampilkan warna/status berdasarkan hasil pengecekan
                      error={emailCheckStatus === 'unavailable' || emailCheckStatus === 'error'}
                      color={emailCheckStatus === 'available' ? 'success' : 'primary'}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleCheckEmail}
                      disabled={isCheckingEmail || !formData.email || isEditMode}
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
                {/* <Grid item xs={12} sm={4}> */}
                {/* <TextField margin="none" sx={{width: lebartextbox,}} size="small" label="ID Perumahan" name="residential_id" value={formData.residential_id} onChange={handleInputChange} required /> */}
                {/* <TextField
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
                  </TextField> */}
                {/* </Grid> */}
                <Grid item xs={12} sm={4}>
                  <TextField margin="none" sx={{ width: lebartextbox, }} size="small" label="Nomor Rumah" name="house_number" value={formData.house_number} onChange={handleInputChange} required />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField margin="none" sx={{ width: lebartextbox, }} size="small" label="Total Keluarga" name="total_family" value={formData.total_family} onChange={handleInputChange} type="number" required />
                </Grid>

                {/* Baris 4: RT, RW */}
                {/* <Grid item xs={12} sm={4}>
                  <TextField margin="none" sx={{ width: lebartextbox, }} size="small" label="RT" name="rt" value={formData.rt} onChange={handleInputChange} required />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField margin="none" sx={{ width: lebartextbox, }} size="small" label="RW" name="rw" value={formData.rw} onChange={handleInputChange} required />
                </Grid> */}
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
            {/* <DialogActions sx={{ padding: 2 }}> */}
            {/* <Button onClick={handleCekData} color="warning" variant="outlined" disabled={isSaving}>Cek Data</Button> */}
            {/* <Button onClick={handleCloseForm} color="error" variant="outlined" disabled={isSaving}>Batal</Button> */}
            {/* <Button type="submit" variant="contained" color="success" disabled={disableSubmitButton}> */}
            {/* {isSaving ? 'Menyimpan...' : 'Simpan Data'} */}
            {/* </Button> */}
            {/* </DialogActions> */}

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