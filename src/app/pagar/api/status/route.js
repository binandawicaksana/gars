// app/api/status/route.js
import { IP_ESP32 } from '../../../utils/constants';
// Ganti dengan IP Address ESP32 Anda yang sebenarnya!
const ESP_IP = IP_ESP32; 
const [IP_ESP, setIP_ESP] = React.useState("");
const [error, setError] = React.useState('');

export async function GET(request) {
  
  try {
    // Panggil endpoint /status di ESP32
    const espUrl = `${ESP_IP}/status`;
    const response = await fetch(espUrl);

    if (response.ok) {
      const data = await response.json();
      
      // Kirim data status JSON dari ESP32 langsung ke frontend
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ 
        error: true, 
        message: `Gagal membaca status dari ESP32 (Status: ${response.status})` 
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error saat menghubungi ESP32:', error.message);
    return new Response(JSON.stringify({ 
      error: true, 
      message: 'Kesalahan Jaringan Server. Cek koneksi ESP32.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}