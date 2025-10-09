import { Poppins } from "next/font/google";
import "./globals.css";


const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'], // Pilih ketebalan yang sering digunakan
  variable: '--font-poppins', // 💡 Tentukan variable CSS kustom
});

export const metadata = {
  title: "GARS - Guarding System For Residential Areas",
  description: "GARS - Guarding system for residential areas",
  icons: {
    icon: '/images/home_image2.png', // Jika file logo Anda bernama favicon.ico di folder public
    // atau
    // icon: '/logo.png',  // Jika file logo Anda bernama logo.png di folder public
  },
};

// app/layout.js (Update)
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import ThemeRegistry from './ThemeRegistry'; // Import komponen baru

export default function RootLayout({ children }) {
  return (
     <html lang="en" className={poppins.variable}> 
      <body>
        <AppRouterCacheProvider>
          <ThemeRegistry>
            {children}
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
