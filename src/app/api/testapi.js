// app/page.js

// Komponen utama untuk halaman ini.
// Di Next.js 15 App Router, komponen ini secara default adalah Server Component (SC).
export default function TestApi() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Selamat Datang di Halaman Next.js Sederhana!</h1>
      <p>
        Ini adalah contoh halaman yang dibuat menggunakan **Next.js 15 App Router**.
        Konten ini di-*render* di sisi server.
      </p>
      <hr />
      <p>
        **Catatan:** Next.js sangat efisien. Anda dapat menambahkan CSS, data fetching, 
        dan interaktivitas dengan mudah di sini.
      </p>
    </div>
  );
}