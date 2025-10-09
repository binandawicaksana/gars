// app/users/page.js
import AdminLayout from '../components/AdminLayout'; 
import { Typography, Paper } from '@mui/material';

export default function SatpamPage() {
  return (
    <AdminLayout>
      <Typography variant="h4" gutterBottom>
        Manajemen Data Security
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Di sini Anda akan meletakkan komponen Data Table MUI */}
        <Typography>
            Load data pengguna dari API PHP di sini.
        </Typography>
      </Paper>
    </AdminLayout>
  );
}