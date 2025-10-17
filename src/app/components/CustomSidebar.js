// components/CustomSidebar.js
import { Drawer, Toolbar, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Divider, Box, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ShieldIcon from '@mui/icons-material/Shield';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Person4Icon from '@mui/icons-material/Person4';
import Groups3Icon from '@mui/icons-material/Groups3';
import Link from 'next/link';
import HomeImage from '../assets/images/home_image2.png'; 

// Data menu navigasi
const navItems = [
  { text: 'Dashboard Warga', icon: <DashboardIcon />, href: '/' },
  { text: 'Data Warga', icon: <Groups3Icon />, href: '/warga' },
  { text: 'Data Satpam', icon: <AdminPanelSettingsIcon />, href: '/satpam' },
  // { text: 'Pengguna', icon: <PeopleIcon />, href: '/users' },
  { text: 'Pengaturan', icon: <SettingsIcon />, href: '/settings' },
];

export default function CustomSidebar({ drawerWidth, mobileOpen, handleDrawerToggle }) {
  const drawerContent = (
    <div>
      <Toolbar>
        <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5, // Jarak antara logo dan teks
        }}>
            {/* 1. Tambahkan Tag Gambar */}
            {/* Pastikan 'logo-gars.png' ada di folder public Anda */}
            <img 
                // src="/images/home_image.png" 
                src={HomeImage.src} 
                alt="GARS Logo" 
                style={{ 
                    height: '32px', // Sesuaikan tinggi logo
                    width: 'auto', 
                }}
            />
            
            {/* 2. Teks GARS */}
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
                GARS
            </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <Link href={item.href} passHref style={{ textDecoration: 'none', width: '100%' }}>
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
      <Divider />
      {/* Tambahkan item navigasi lain di sini jika perlu */}
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* Drawer untuk tampilan Mobile (yang bisa ditutup) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} // Untuk performa mobile yang lebih baik
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
      
      {/* Drawer untuk tampilan Desktop (yang permanen/fixed) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}