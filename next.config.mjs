/** @type {import('next').NextConfig} */
const nextConfig = {
    // ... (konfigurasi lain, jika ada)
  //   output: 'export', 
  //   basePath: '/gars', 
  //   images: {
  //   unoptimized: true,
  // },

    
    // ✅ Tambahkan fungsi async rewrites()
    async rewrites() {
        return [
          {
            // source: Path yang akan digunakan di frontend (Next.js)
            // Kami akan menggunakan /api/v1/ untuk endpoint
            source: '/api/v1/:path*',
            
            // destination: URL API CodeIgniter Anda yang sebenarnya
            // :path* memastikan sisa URL diteruskan ke CodeIgniter
            // Contoh: /api/v1/C_detailuser/get_detail_user 
            //         akan menuju http://192.168.56.1/firegars/C_detailuser/get_detail_user
             //localhost
            // destination: 'http://192.168.56.1/firegars/:path*',
            //hosting
           destination: 'https://soratenteknologi.my.id/firegars/:path*', 

          },
        ];
    },
};

export default nextConfig;
