// app/api/servo/route.js

// Ganti dengan IP Address ESP32 Anda yang sebenarnya!
const ESP_IP = 'http://192.168.43.169'; 

// Route Handler Next.js versi App Router menggunakan fungsi GET
export async function GET(request) {
  // 1. Ambil query parameter 'direction' dari URL
  const { searchParams } = new URL(request.url);
  const direction = searchParams.get('direction');

  if (direction !== 'kiri' && direction !== 'kanan') {
    return new Response(JSON.stringify({ success: false, message: 'Parameter direction tidak valid.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // 2. Kirim permintaan dari server Next.js (proxy) ke ESP32
    const espUrl = `${ESP_IP}/servo/${direction}`;
    console.log(`Menghubungi ESP32 di: ${espUrl}`);
    
    const response = await fetch(espUrl);

    if (response.ok) {
      // 3. Baca respons dari ESP32 dan kirim kembali ke frontend
      const text = await response.text();
      return new Response(JSON.stringify({ success: true, message: text }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // Tangani jika ESP32 merespons dengan error (misalnya 404 atau 500)
      const errorText = await response.text();
      return new Response(JSON.stringify({ 
        success: false, 
        message: `ESP32 merespons: Status ${response.status}`, 
        espResponse: errorText
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error saat menghubungi ESP32:', error.message);
    // Tangani error jaringan (misalnya ESP32 mati/IP salah)
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Kesalahan Jaringan Server. Cek IP dan koneksi ESP32.',
      errorDetail: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}